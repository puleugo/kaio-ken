import type { FileInfoDto } from "../dto/file-info.dto";

export interface FileClient {
	exists(path: string): Promise<boolean>;
	get(path: string): Promise<Buffer>;
	find(path: string): Promise<Buffer | null>;
	getFilesFromDirectory(dirPath: string): Promise<FileInfoDto[]>;
}
