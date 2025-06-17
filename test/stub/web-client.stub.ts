import { type BodyInserter, ResponseSpec, type WebClient } from "@src/module/repository/web.client";

export class WebClientStub implements WebClient {
	url = "";
	method = "GET";
	#headers: Record<string, string>[] = [];
	requestBodies: string[] = [];
	#response: {
		statusCode: number;
		body: string;
	}[] = [];
	requests: { method: string; url: string }[] = [];
	private _body: string | null = null;

	get methods(): string[] {
		return this.requests.map((request) => request.method);
	}

	get urls(): string[] {
		return this.requests.map((request) => request.url);
	}

	uri(path: string): this {
		this.url = path;
		return this;
	}

	headers(headers: Record<string, string>): this {
		this.#headers.push(headers);
		return this;
	}

	get(): this {
		this.method = "GET";
		return this;
	}

	post(): this {
		this.method = "POST";
		return this;
	}

	put(): this {
		this.method = "PUT";
		return this;
	}

	delete(): this {
		this.method = "DELETE";
		return this;
	}

	body<T>(body: BodyInserter<T>): this {
		this._body = body.toString();
		this.requestBodies.push(body.toString());
		return this;
	}

	async retrieve(): Promise<ResponseSpec> {
		this.requests.push({ method: this.method, url: this.url });
		const response = this.#response.shift();
		if (!response) {
			throw new Error("response is not defined. Please set responses in the stub.");
		}

		return new ResponseSpec(response.statusCode, response.body);
	}

	clear(): this {
		this.url = "";
		this.method = "GET";
		this.requestBodies = [];
		this.requests = [];
		this.#response = [];
		this.#headers = [];

		return this;
	}

	pushResponse(...responses: { statusCode: number; body: string }[]): this {
		this.#response.push(...responses);
		return this;
	}
}
