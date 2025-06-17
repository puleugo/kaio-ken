import { UniqueEntityId } from "@src/core/unique-identifier";
import type { BlogPublishedId } from "@src/module/domain/blog-published-id";
import type { Language } from "@src/module/domain/language";
import type { Translation } from "@src/module/domain/translation";
import { Translations } from "@src/module/domain/translations";
import type { FunctionalToolDto } from "@src/module/dto/functional-tool.dto";
import type { MessageDto } from "@src/module/dto/message.dto";
import type { FileReader } from "@src/module/implemention/file.reader";
import type { Translator } from "@src/module/implemention/translator";
import { PostParser } from "@src/module/parser/post-parser";
import type { Logger } from "@src/module/repository/logger";
import type { AiClient } from "@src/module/repository/translator.repository";
import { ArrayUtil } from "@src/shared/util/array.util";
import { BpeTokenCalculator, type TokenCalculator } from "@src/shared/util/bpe-token-calculator";
import { StringBuilder } from "@src/shared/util/string-builder";

export class ChatGptTranslator implements Translator {
	private readonly tokenCalculator: TokenCalculator;
	private static PROMPT_MESSAGE = new StringBuilder()
		.appendLine("You are a helpful assistant that translates blog posts. Here is Rule.")
		.appendLine("1. Don't shorten the content")
		.appendLine("2. Don't change the meaning of the content")
		.appendLine("3. Don't Remove Markdown Image URL in the content")
		.appendLine("4. Add anything that is lacking in the description")
		.toString();

	constructor(
		private readonly aiClient: AiClient,
		private readonly fileReader: FileReader,
		private readonly logger: Logger,
	) {
		this.tokenCalculator = new BpeTokenCalculator(30000);
	}

	async translatePosts(props: { language: Language; lastPublishedId: BlogPublishedId }[]): Promise<Translations> {
		const metadata = await this.fileReader.getMetadata();

		const minTranslationId = Math.min(...props.map((prop) => prop.lastPublishedId.toNumber()));
		const maxOriginalId = metadata.publisher.lastPublishedId.toNumber();
		const baseLanguage: Language = metadata.publisher.language;
		const translations: Translation[] = [];

		try {
			for (const currentIdx of ArrayUtil.range(minTranslationId + 1, maxOriginalId + 1)) {
				const currentId = UniqueEntityId.create(currentIdx);
				this.logger.info(`Translating post with ID: ${currentId.toString()}`);
				const basePost = await this.fileReader.getPost(currentId, baseLanguage);

				for (const { language, lastPublishedId } of props) {
					if (currentId.beforeOrEquals(lastPublishedId.toNumber())) continue;
					const messages: MessageDto[] = [
						{
							role: "system",
							content: ChatGptTranslator.PROMPT_MESSAGE,
						},
						{
							role: "user",
							content: new StringBuilder()
								.appendLine(`# ${basePost.title}`)
								.appendLine()
								.appendLine(`${basePost.content}`)
								.toString(),
						},
					];

					this.tokenCalculator.addText(messages[0].content + messages[1].content);
					if (this.tokenCalculator.hasTokenOverflowed) break;

					const tools: FunctionalToolDto[] = [
						{
							type: "function",
							function: {
								name: "translate_post",
								description: "Translate the post to the target language",
								parameters: {
									type: "object",
									properties: {
										translatedTitle: {
											type: "string",
											description: `The translated title of the post by ${language.toString()}`,
										},
										translatedContent: {
											type: "string",
											description: `The translated content of the post by ${language.toString()}`,
										},
									},
									required: ["translatedTitle", "translatedContent"],
								},
							},
						},
					];

					const result = await this.aiClient
						.function(messages, tools)
						.then((response) => JSON.parse(response.output[0].arguments));

					translations.push(
						PostParser.parseToTranslation(
							{
								title: result.translatedTitle,
								uploadedAt: null,
								url: null,
								language: language.toString(),
								content: result.translatedContent,
							},
							currentId,
						),
					);
				}
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				this.logger.warn(`message: ${err.message}\nstack: ${err.stack}`);
			}
		}

		return Translations.create(translations);
	}
}
