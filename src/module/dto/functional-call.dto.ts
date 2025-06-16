export class FunctionCallDto {
	id: string;
	object: string;
	created_at: number;
	status: "completed" | "failed" | "cancelled";
	error: string | null;
	incomplete_details: string | null;
	instructions: string | null;
	max_output_tokens: number | null;
	model: string;
	output: GptFunctionCallOutput[];
	parallel_tool_calls: boolean;
	previous_response_id: string | null;
	reasoning: {
		effort: string | null;
		summary: string | null;
	};
	store: boolean;
	temperature: number;
	text: {
		format: {
			type: "text" | string;
		};
	};
	tool_choice: string;
	tools: GptFunctionToolDefinition[];
	top_p: number;
	truncation: "disabled" | string;
	usage: {
		input_tokens: number;
		output_tokens: number;
		output_tokens_details: {
			reasoning_tokens: number;
		};
		total_tokens: number;
	};
	user: string | null;
	metadata: Record<string, unknown>;
}

class GptFunctionCallOutput {
	type: "function_call" | string;
	id: string;
	call_id: string;
	name: string;
	arguments: string; // JSON string, parse if needed
	status: "completed" | "failed" | string;
}

class GptFunctionToolDefinition {
	type: "function" | string;
	description: string;
	name: string;
	parameters: {
		type: "object";
		properties: Record<
			string,
			{
				type: string;
				description?: string;
				enum?: string[];
			}
		>;
		required: string[];
	};
	strict: boolean;
}
