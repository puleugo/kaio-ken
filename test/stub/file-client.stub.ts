import { parse } from "node:path";
import type { FileInfoDto } from "@src/module/dto/file-info.dto";
import type { FileClient } from "@src/module/repository/file-client";

export class FileClientStub implements FileClient {
	files: Map<string, FileInfoDto> = new Map();

	async exists(path: string): Promise<boolean> {
		return this.files.has(path);
	}

	async get(path: string): Promise<Buffer> {
		const buffer = this.files.get(path);
		if (!buffer) {
			throw new Error(`File not found: ${path}`);
		}
		return buffer.buffer();
	}

	async find(path: string): Promise<Buffer | null> {
		return this.files.get(path)?.buffer() ?? null;
	}

	async getFilesFromDirectory(dirPath: string): Promise<FileInfoDto[]> {
		const files: FileInfoDto[] = [];
		for (const [key, value] of this.files.entries()) {
			if (key.startsWith(`${dirPath}/`)) {
				files.push(value);
			}
		}
		return files;
	}

	async write(path: string, content: string): Promise<void> {
		const filename = path.split("/").pop() || "";
		this.files.set(path, {
			path,
			filename,
			name: parse(filename).name,
			buffer: async () => Buffer.from(content),
		});
	}

	setFile(...files: FileInfoDto[]): void {
		for (const file of files) {
			this.files.set(file.path, file);
		}
	}

	clear(): void {
		this.files.clear();
	}
}
