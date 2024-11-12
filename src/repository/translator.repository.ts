import {envManager, EnvManager} from "../util/config/env-manager";
import { zodResponseFormat } from "openai/helpers/zod";
import {ZodObject} from 'zod'
import OpenAI from "openai";
import {ZodRawShape} from "zod/lib/types";

export interface AiRepositoryInterface {
	chat<ZOD_RAW extends ZodRawShape>(system: string, user: string, json: {zod: ZodObject<ZOD_RAW>, name: string}): Promise<any>;
}

class ChatGptTranslatorRepository implements AiRepositoryInterface{

	private openai = null;
	constructor(private readonly envManager: EnvManager) {}

	private authenticateIfNeeded(){
		if (this.openai) {
			return;
		}
		this.openai = new OpenAI({
			apiKey: this.envManager.getOrThrow('OPENAI_API_KEY')
		})
	}

	async chat<ZOD_RAW extends ZodRawShape>(system: string, user: string, json: {zod: ZodObject<ZOD_RAW>, name: string}): Promise<any> {
		this.authenticateIfNeeded();

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
		} catch (error) {
			throw new Error("Failed to translate the blog post.");
		}
	}
}

export const chatGptTranslatorRepository = new ChatGptTranslatorRepository(envManager);
