export class FunctionalToolDto {
	type: "function";
	function: {
		name: string;
		description: string;
		parameters: {
			type: "object";
			properties: Record<string, { type: string; description?: string; enum?: string[] }>;
			required: string[];
		};
	};
}
