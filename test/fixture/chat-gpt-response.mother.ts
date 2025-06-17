import type { FunctionCallDto } from "@src/module/dto/functional-call.dto";

export namespace ChatGptResponseMother {
	export function create(): FunctionCallDto {
		return {
			id: "test-id",
			object: "function_call",
			created_at: Date.now(),
			status: "completed",
			error: null,
			incomplete_details: null,
			instructions: null,
			max_output_tokens: null,
			model: "gpt-4",
			output: [
				{
					type: "function_call",
					id: "test-output-id",
					call_id: "test-call-id",
					name: "translate",
					arguments: JSON.stringify({
						translatedTitle: "How to Test the ChatGPT Response",
						translatedContent: "This is a test content for the ChatGPT response.",
					}),
					status: "completed",
				},
			],
			parallel_tool_calls: false,
			previous_response_id: null,
			reasoning: {
				effort: null,
				summary: null,
			},
			store: false,
			temperature: 0.7,
			text: {
				format: {
					type: "text",
				},
			},
			tool_choice: "auto",
			tools: [],
			top_p: 1,
			truncation: "disabled",
			usage: {
				input_tokens: 10,
				output_tokens: 20,
				output_tokens_details: {
					reasoning_tokens: 5,
				},
				total_tokens: 30,
			},
			user: null,
			metadata: {},
		};
	}

	export function createJson(): string {
		return JSON.stringify(create());
	}
}
