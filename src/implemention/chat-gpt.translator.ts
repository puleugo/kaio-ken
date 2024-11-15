import {Posts} from "../domain/posts";
import {AiRepositoryInterface, chatGptTranslatorRepository} from "../repository/translator.repository";
import {z}from "zod";
import {TranslatedPosts} from "../domain/translatedPosts";
import {HrefTagEnum, isHrefTagEnum} from "../type";
import {ShouldTranslatePostsByLanguage} from "./post.reader";
import {PostEntity} from "../domain/postEntity";
import {githubReader, GithubReaderInterface} from "./github.reader";
import {BpeTokenCalculator, TokenCalculatorInterface} from "./token-calculator";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";

export interface TranslatorInterface {
	  translatePostsByLanguages(targetLanguageByPosts: ShouldTranslatePostsByLanguage): Promise<TranslatedPosts>;
}

export class ChatGptTranslator implements TranslatorInterface{
	private readonly tokenCalculator: TokenCalculatorInterface;
	constructor(private readonly aiClient: AiRepositoryInterface, private readonly githubReader: GithubReaderInterface, private readonly logger: LoggerInterface) {
		this.tokenCalculator = new BpeTokenCalculator(30000);
	}

	async translatePostsByLanguages(targetLanguageByPosts: ShouldTranslatePostsByLanguage): Promise<TranslatedPosts> {
		const translatedPosts = await Promise.all(Object.entries(targetLanguageByPosts).map(([language, posts]) => {
			if (!isHrefTagEnum(language)) {
				throw new Error(`올바르지 않은 언어입니다: ${language}`);
			}
			if(posts.isEmpty) {
				return
			}

			return this.translatePosts(posts, language);
		})).then(posts => posts.flat().filter(posts => posts !== undefined));

		return new TranslatedPosts(translatedPosts);
    }

	private async translatePosts(posts: Posts, targetLanguage: HrefTagEnum): Promise<PostEntity[]> {
		const existPosts = await this.githubReader.readPosts(targetLanguage, new Set(posts.indexes));

		const expectTranslatedResult = z.object({
			translatedTitle: z.string(),
			translatedContent: z.string()
		})

		// TODO: 번역 요청 성능 개선: 1회의 요청만으로도 가능해보인다.
		return Promise.all(posts.toEntities.map(async (post): Promise<PostEntity> => {
			if(existPosts.hasPost(post)) {
				return existPosts.getById(post.index);
			}

			const systemMessage = `You are a helpful assistant that translates blog posts from ${post.language} to ${targetLanguage}.\n Here is Rule.`+
					`1. Don't shorten the content\n`+
					`2. Don't change the meaning of the content\n`+
					`3. Don't Remove Markdown Image URL in the content\n`+
					`4. Add anything that is lacking in the description`;
			const postMessage = `# ${post.title}\n ${post.content}`;

			if (!this.tokenCalculator.canBeRequest(systemMessage+postMessage)) {
				this.logger.warn(`1회 번역량 제한을 초과했습니다. ${post.index}번 글은 번역을 건너뜁니다. 약 3분후에 호출 제한이 풀립니다.`);
				return;
			}
			this.tokenCalculator.addText(systemMessage+postMessage);
			const result = await this.aiClient.chat(
				systemMessage,
				postMessage,
				{zod: expectTranslatedResult, name: 'expectTranslatedResult'}
			)
			this.logger.debug(`${post.index}번 글 번역에 성공했습니다.`)

			post.updateTranslate({
				title: result.translatedTitle,
				content: result.translatedContent,
				language: targetLanguage
			})
			return post;
		}).filter(post => post !== undefined));
	}
}

export const chatGptTranslator = new ChatGptTranslator(chatGptTranslatorRepository, githubReader, githubActionLogger);
