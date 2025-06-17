export interface UploadedFileDto {
	url: string;
	path: string;
	sha: string;
	type: "file" | "dir";
	commitMessage?: string;
	uploadedAt?: Date;
}
