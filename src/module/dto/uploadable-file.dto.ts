export interface UploadableFileDto {
	path: string;
	/** Base64 encoded */
	content: Buffer;
	commitMessage?: string;
	sha?: string;
}
