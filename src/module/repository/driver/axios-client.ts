import axios, { type AxiosRequestConfig } from "axios";
import { type BodyInserter, ResponseSpec, type WebClient } from "../web.client";

export class AxiosClient implements WebClient {
	private readonly _options: AxiosRequestConfig = {};
	private _body: BodyInserter<unknown> | null = null;

	constructor(url?: string, timeout = 10_000) {
		this._options = {
			method: "GET",
			url,
			timeout,
		};
	}

	uri(uri?: string): this {
		this._options.url = uri;
		return this;
	}

	headers(headers: Record<string, string>): this {
		if (!this._options.headers) {
			this._options.headers = {};
		}
		Object.assign(this._options.headers, headers);
		return this;
	}

	get(): this {
		this._options.method = "GET";
		return this;
	}

	post(): this {
		this._options.method = "POST";
		return this;
	}

	put(): this {
		this._options.method = "PUT";
		return this;
	}

	delete(): this {
		this._options.method = "DELETE";
		return this;
	}

	body<T>(body: BodyInserter<T>): this {
		this._body = body;
		return this;
	}

	async retrieve(): Promise<ResponseSpec> {
		const response = await axios.request({
			...this._options,
			validateStatus: (status) => status < 500,
			data: this._body ? this._body : undefined,
		});
		return new ResponseSpec(response.status, JSON.stringify(response.data));
	}
}
