import { ZodRawShape, ZodObject } from "zod";
import {AiRepositoryInterface} from "../../src/repository/translator.repository";

export class AiRepositoryStub implements AiRepositoryInterface {
	private _chatCount = 0;
    async chat<ZOD_RAW extends ZodRawShape>(system: string, user: string, json: { zod: ZodObject<ZOD_RAW>; name: string; }): Promise<any> {
		this._chatCount++;
		return {
			translatedTitle: '번역 제목',
			translatedContent: '번역 내용'
		}
    }

	get chatCount() {
		return this._chatCount;
	}

	reset() {
		this._chatCount = 0;
	}
}
