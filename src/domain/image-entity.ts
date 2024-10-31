import {randomUUID} from "node:crypto";

interface ImageValue {
	src: string;
	alt: string | null;
	extension: string;
	content: Buffer | null
}

export class ImageEntity {
	readonly id: string;
	constructor(private readonly value: ImageValue, id?: string) {
		this.id = id || randomUUID();
	}

	get filename(): string {
		return `${this.id}.${this.value.extension}`;
	}

	get content(): string {
		return this.value.content.toString('base64');
	}

	set content(content: Buffer) {
		this.value.content = content;
	}

	get url(): string {
		return this.value.src;
	}
}
