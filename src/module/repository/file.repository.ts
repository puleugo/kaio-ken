import type { UploadableFileDto } from "../dto/uploadable-file.dto";
import type { UploadedFileDto } from "../dto/uploaded-file.dto";

export interface GithubClient {
	upload(...files: UploadableFileDto[]): Promise<UploadedFileDto[]>;
	deleteFile(filePath: string): void;
	deleteDirectory(path: string): void;
}
