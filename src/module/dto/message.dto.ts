export class MessageDto {
	role: "system" | "user" | "assistant";
	content: string;
}
