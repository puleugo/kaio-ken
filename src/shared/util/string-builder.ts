export class StringBuilder {
	private value: Array<string>;

	constructor() {
		this.value = [];
	}

	append(str: string): StringBuilder {
		this.value.push(str);
		return this;
	}

	appendLine(str = ""): StringBuilder {
		this.value.push(`${str}\n`);
		return this;
	}

	clear(): void {
		this.value = [];
	}

	toString(separator = ""): string {
		return this.value.join(separator);
	}

	toBase64(): string {
		return Buffer.from(this.toString()).toString("base64");
	}
}
