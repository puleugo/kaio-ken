export interface FileInfoDto {
	path: string;
	filename: string;
	name: string;
	buffer: () => Promise<Buffer>;
}
