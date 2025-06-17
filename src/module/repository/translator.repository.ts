import type { FunctionCallDto } from "../dto/functional-call.dto";
import type { FunctionalToolDto } from "../dto/functional-tool.dto";
import type { MessageDto } from "../dto/message.dto";

export interface AiClient {
	function(messages: MessageDto[], tools: FunctionalToolDto[]): Promise<FunctionCallDto>;
}
