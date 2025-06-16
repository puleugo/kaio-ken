import { ChatGptClient } from "@src/module/repository/driver/chat-gpt.client";
import { ChatGptMessageMother } from "@test/fixture/chat-gpt-message.mother";
import { ChatGptResponseMother } from "@test/fixture/chat-gpt-response.mother";
import { ChatGptToolMother } from "@test/fixture/chat-gpt-tool.mother";
import { WebClientStub } from "@test/stub/web-client.stub";

describe("ChatGptClient Unit Test", () => {
	let webClient: WebClientStub;
	let chatGptClient: ChatGptClient;

	beforeEach(() => {
		webClient = new WebClientStub();
		chatGptClient = new ChatGptClient({ apiKey: "" }, webClient, console);
	});

	describe("function()", () => {
		it("should request to 'https://api.openai.com/v1/chat/completions' API", async () => {
			const response = ChatGptResponseMother.create();
			webClient.pushResponse(201, JSON.stringify(response));

			const messages = ChatGptMessageMother.create();
			const tools = ChatGptToolMother.create();

			const result = await chatGptClient.function(messages, tools);
			expect(webClient.urls[0]).toBe("https://api.openai.com/v1/chat/completions");
			expect(webClient.methods[0]).toBe("POST");
			expect(webClient.requestBodies.length).toBe(1);
			expect(JSON.parse(webClient.requestBodies[0])).toStrictEqual({
				model: "gpt-4o",
				messages,
				tools,
				tool_choice: "auto",
			});
			expect(result).toEqual(response);
		});
	});
});
