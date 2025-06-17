import { FunctionCallDto } from "../../dto/functional-call.dto";
import type { FunctionalToolDto } from "../../dto/functional-tool.dto";
import type { MessageDto } from "../../dto/message.dto";
import type { Logger } from "../logger";
import type { AiClient } from "../translator.repository";
import { BodyInserter, type WebClient } from "../web.client";

interface Options {
	apiKey: string;
}

export class ChatGptClient implements AiClient {
	constructor(
		options: Options,
		private readonly client: WebClient,
		private readonly logger: Logger,
	) {
		this.client.headers({
			"Content-Type": "application/json",
			Authorization: `Bearer ${options.apiKey}`,
		});
	}

	async function(messages: MessageDto[], tools: FunctionalToolDto[]): Promise<FunctionCallDto> {
		return await this.client
			.uri("https://api.openai.com/v1/chat/completions")
			.post()
			.body(
				BodyInserter.fromJSON({
					model: "gpt-4o",
					messages,
					tools,
					tool_choice: "auto",
				}),
			)
			.retrieve()
			.then((spec) => spec.toEntity(FunctionCallDto));
		// .catch((error: unknown) => {
		// 	if (error instanceof RateLimitError) {
		// 		this.logger.error("번역 요청량이 OpenAI API 제한을 초과했습니다.");
		// 		throw error;
		// 	}
		// 	if (error instanceof APIError) {
		// 		this.logger.error(`${error.code}, ${error.message}, 게시글 번역에 실패했습니다.`);
		// 		throw error;
		// 	}
		// 	this.logger.error(`게시글 번역을 실패했습니다: ${error}`);
		// 	throw error;
		// });
	}
}
