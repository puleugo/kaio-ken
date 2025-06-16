import type { FunctionalToolDto } from "@src/module/dto/functional-tool.dto";

export namespace ChatGptToolMother {
	export function create(): FunctionalToolDto[] {
		return [
			{
				type: "function",
				function: {
					name: "translate",
					description: "Translate text to target language",
					parameters: {
						type: "object",
						properties: {
							text: { type: "string" },
							targetLanguage: { type: "string" },
						},
						required: ["text", "targetLanguage"],
					},
				},
			},
		];
	}
}
