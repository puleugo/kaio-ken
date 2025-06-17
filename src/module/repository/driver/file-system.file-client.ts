import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type { FileInfoDto } from "@src/module/dto/file-info.dto";
import type { FileClient } from "@src/module/repository/file-client";

export class FileSystemFileClient implements FileClient {
	async exists(path: string): Promise<boolean> {
		return existsSync(path);
	}

	async find(path: string): Promise<Buffer | null> {
		const buffer = await fs.readFile(path);
		if (!buffer) return null;
		return buffer;
	}

	async get(filePath: string): Promise<Buffer> {
		return await fs.readFile(filePath);
	}

	async getFilesFromDirectory(dirPath: string): Promise<FileInfoDto[]> {
		const fileNames = await fs.readdir(dirPath, { withFileTypes: true });

		const promises = fileNames.map(async (entry): Promise<FileInfoDto[]> => {
			const entryPath = path.join(entry.parentPath, entry.name);
			if (entry.isDirectory()) return this.getFilesFromDirectory(entryPath);

			return [
				{
					path: entryPath,
					filename: entry.name,
					name: path.parse(entry.name).name,
					buffer: async () => await fs.readFile(entryPath),
				},
			];
		});
		const files = await Promise.all(promises);
		return files.flat();
	}
}
