import type { MessageDto } from "@src/module/dto/message.dto";

export namespace ChatGptMessageMother {
	export function create(): MessageDto[] {
		return [
			{
				role: "user",
				content: "Hello, how are you?",
			},
		];
	}
}
