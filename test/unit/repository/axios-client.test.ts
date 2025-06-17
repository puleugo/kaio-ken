import { AxiosClient } from "@src/module/repository/driver/axios-client";
import { BodyInserter, ResponseSpec } from "@src/module/repository/web.client";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AxiosClient", () => {
	let client: AxiosClient;

	beforeEach(() => {
		client = new AxiosClient();
		jest.clearAllMocks();
	});

	describe("constructor", () => {
		it("should initialize with default values", () => {
			const client = new AxiosClient();
			expect(client).toBeDefined();
		});

		it("should initialize with custom url and timeout", () => {
			const client = new AxiosClient("https://api.example.com", 5000);
			expect(client).toBeDefined();
		});
	});

	describe("uri", () => {
		it("should set the URL", () => {
			const url = "https://api.example.com";
			client.uri(url);
			expect(client).toBeDefined();
		});
	});

	describe("headers", () => {
		it("should set headers", () => {
			const headers = { "Content-Type": "application/json" };
			client.headers(headers);
			expect(client).toBeDefined();
		});
	});

	describe("HTTP methods", () => {
		it("should set GET method", () => {
			client.get();
			expect(client).toBeDefined();
		});

		it("should set POST method", () => {
			client.post();
			expect(client).toBeDefined();
		});

		it("should set PUT method", () => {
			client.put();
			expect(client).toBeDefined();
		});

		it("should set DELETE method", () => {
			client.delete();
			expect(client).toBeDefined();
		});
	});

	describe("body", () => {
		it("should set request body", () => {
			const body = BodyInserter.fromJSON({ key: "value" });
			client.body(body);
			expect(client).toBeDefined();
		});
	});

	describe("retrieve", () => {
		it("should make a successful request", async () => {
			const mockResponse = {
				status: 200,
				data: { message: "success" },
			};

			mockedAxios.request.mockResolvedValueOnce(mockResponse);

			const response = await client.retrieve();

			expect(response).toBeInstanceOf(ResponseSpec);
			expect(response.statusCode).toBe(200);
			expect(response.rawBody).toBe(JSON.stringify(mockResponse.data));
		});

		it("should handle request with body", async () => {
			const mockResponse = {
				status: 201,
				data: { id: 1 },
			};

			mockedAxios.request.mockResolvedValueOnce(mockResponse);

			const body = BodyInserter.fromJSON({ name: "test" });
			client.body(body);

			const response = await client.retrieve();

			expect(response).toBeInstanceOf(ResponseSpec);
			expect(response.statusCode).toBe(201);
			expect(response.rawBody).toBe(JSON.stringify(mockResponse.data));
		});

		it("should handle request with headers", async () => {
			const mockResponse = {
				status: 200,
				data: { message: "success" },
			};

			mockedAxios.request.mockResolvedValueOnce(mockResponse);

			client.headers({ Authorization: "Bearer token" });

			const response = await client.retrieve();

			expect(response).toBeInstanceOf(ResponseSpec);
			expect(response.statusCode).toBe(200);
		});

		it("should handle error responses", async () => {
			const mockResponse = {
				status: 404,
				data: { error: "Not found" },
			};

			mockedAxios.request.mockResolvedValueOnce(mockResponse);

			const response = await client.retrieve();

			expect(response).toBeInstanceOf(ResponseSpec);
			expect(response.statusCode).toBe(404);
			expect(response.rawBody).toBe(JSON.stringify(mockResponse.data));
		});
	});
});
