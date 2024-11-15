import {envManager, EnvManager} from "../util/config/env-manager";
import { zodResponseFormat } from "openai/helpers/zod";
import {ZodObject} from 'zod'
import OpenAI from "openai";
import {ZodRawShape} from "zod/lib/types";
import {githubActionLogger, GithubActionLogger} from "../util/logger/github-action.logger";
import {APIError, RateLimitError} from "openai/error";

export interface AiRepositoryInterface {
	chat<ZOD_RAW extends ZodRawShape>(system: string, user: string, json: {zod: ZodObject<ZOD_RAW>, name: string}): Promise<any>;
}

class ChatGptTranslatorRepository implements AiRepositoryInterface{

	private openai = null;
	constructor(private readonly envManager: EnvManager, private readonly logger: GithubActionLogger) {}

	private authenticateIfNeeded(){
		if (this.openai) {
			return;
		}
		this.openai = new OpenAI({
			apiKey: this.envManager.getOrThrow('OPENAI_API_KEY')
		})
		this.logger.debug('OpenAI API 인증에 성공했습니다.')
	}

	async chat<ZOD_RAW extends ZodRawShape>(system: string, user: string, json: {zod: ZodObject<ZOD_RAW>, name: string}): Promise<any> {
		this.authenticateIfNeeded();
		this.logger.debug('게시글 번역을 시작합니다.');
		this.logger.debug(`번역 요청: ${user}`);

		try {
			const completion = await this.openai.beta.chat.completions.parse({
				model: "gpt-4o",
				messages: [
					{ role: "system", content: system },
					{ role: "user", content: user },
				],
				response_format: zodResponseFormat(json.zod, json.name)
			});

			return completion.choices[0].message.parsed;
		} catch (error: APIError | unknown) {
			if (error instanceof RateLimitError) {
				this.logger.error('번역 요청량이 OpenAI API 제한을 초과했습니다.');
				throw error;
			}
			else if (error instanceof APIError) {
				this.logger.error(`${error.code}, ${error.message}, 게시글 번역에 실패했습니다.`);
				throw error;
			}
			this.logger.error(`게시글 번역을 실패했습니다.`);
			throw error;
		}
	}
}

export const chatGptTranslatorRepository = new ChatGptTranslatorRepository(envManager, githubActionLogger);
