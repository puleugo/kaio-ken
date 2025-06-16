import { type ClassConstructor, plainToInstance } from "class-transformer";

export class ResponseSpec {
	constructor(
		private readonly _statusCode: number,
		private readonly _body: string,
	) {}

	toEntity<T>(entity: ClassConstructor<T>): T {
		return plainToInstance(entity, this.jsonBody);
	}

	get statusCode() {
		return this._statusCode;
	}

	get rawBody(): string {
		return this._body;
	}

	get jsonBody(): Record<string, unknown> {
		try {
			return JSON.parse(this._body);
		} catch (error) {
			throw new Error(`Failed to parse JSON body: ${error}`);
		}
	}
}

enum MediaType {
	APPLICATION_JSON = "application/json",
	APPLICATION_FORM_URLENCODED = "application/x-www-form-urlencoded",
	TEXT_PLAIN = "text/plain",
}

export class BodyInserter<T> {
	private constructor(
		private readonly _mediaType: MediaType,
		private readonly _data: T,
	) {}

	toString(): string {
		if (this._mediaType === MediaType.APPLICATION_JSON) {
			return JSON.stringify(this._data);
		}
		if (this._mediaType === MediaType.APPLICATION_FORM_URLENCODED) {
			return new URLSearchParams(this._data as Record<string, string>).toString();
		}
		if (this._mediaType === MediaType.TEXT_PLAIN) {
			return this._data as string;
		}
		throw new Error(`Unsupported media type: ${this._mediaType}`);
	}

	static fromJSON(json: Record<string, unknown>) {
		return new BodyInserter(MediaType.APPLICATION_JSON, json);
	}

	static fromFormData(form: Record<string, unknown>) {
		return new BodyInserter(MediaType.APPLICATION_FORM_URLENCODED, form);
	}

	static fromText(text: string | Buffer) {
		return new BodyInserter(MediaType.TEXT_PLAIN, text);
	}
}

export interface WebClient {
	uri(uri?: string): this;

	headers(headers: Record<string, string>): this;

	get(): this;

	post(): this;

	put(): this;

	delete(): this;

	body<T>(body: BodyInserter<T>): this;

	retrieve<T>(): Promise<ResponseSpec>;
}
