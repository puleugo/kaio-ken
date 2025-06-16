import { createHash } from "node:crypto";
import { GetRepositoryContentFileDto } from "@src/module/dto/get-repository-content-file.dto";
import { PutRepositoryContentFileDto } from "@src/module/dto/put-repository-content-file.dto";
import type { UploadableFileDto } from "@src/module/dto/uploadable-file.dto";
import type { UploadedFileDto } from "@src/module/dto/uploaded-file.dto";
import type { FileClient } from "@src/module/repository/file-client";
import type { GithubClient } from "@src/module/repository/file.repository";
import type { Logger } from "@src/module/repository/logger";
import { BodyInserter, type WebClient } from "@src/module/repository/web.client";

interface Options {
	owner: string;
	repo: string;
	token: string;
	branch: string;
}

export class GithubClientImpl implements GithubClient {
	constructor(
		private readonly options: Options,
		private readonly webClient: WebClient,
		private readonly fileClient: FileClient,
		private readonly logger: Logger,
	) {
		this.webClient.headers({
			Accept: "application/vnd.github.v3+json",
			Authorization: `Bearer ${options.token}`,
			"X-GitHub-Api-Version": "2022-11-28",
		});
	}

	private getGitBlobSha(content: Buffer): string {
		const header = `blob ${content.length}\0`;
		const store = Buffer.concat([Buffer.from(header), content]);
		return createHash("sha1").update(store).digest("hex");
	}

	private async uploadSingleFile(file: UploadableFileDto): Promise<UploadedFileDto> {
		const githubPath = file.path;
		const content = Buffer.from(file.content).toString();
		let sha: string | undefined = undefined;
		try {
			const readFile = await this.webClient
				.get()
				.uri(`https://api.github.com/repos/${this.options.owner}/${this.options.repo}/contents/${githubPath}`)
				.retrieve()
				.then((spec) => spec.toEntity(GetRepositoryContentFileDto));

			sha = readFile.sha;
		} catch (error) {
			this.logger.info(`파일이 존재하지 않습니다. 새로 업로드합니다: ${githubPath}`);
		}

		if (sha === this.getGitBlobSha(file.content)) {
			return {
				url: `https://api.github.com/repos/${this.options.owner}/${this.options.repo}/contents/${githubPath}`,
				path: file.path,
				sha,
				type: "file",
				commitMessage: file.commitMessage,
				uploadedAt: new Date(),
			};
		}

		try {
			const uploadedFile = await this.webClient
				.put()
				.uri(`https://api.github.com/repos/${this.options.owner}/${this.options.repo}/contents/${githubPath}`)
				.body(
					BodyInserter.fromJSON({
						message: file.commitMessage ?? "`cron(kaio-ken): Upload post",
						content,
						sha, // If the file exists, we need to provide the sha to update it
					}),
				)
				.retrieve()
				.then((spec) => spec.toEntity(PutRepositoryContentFileDto));

			return {
				url: uploadedFile.content.git_url,
				path: uploadedFile.content.path,
				sha: uploadedFile.content.sha,
				type: "file",
				commitMessage: file.commitMessage,
				uploadedAt: new Date(uploadedFile.commit.author.date),
			};
		} catch (error) {
			this.logger.error(`파일 업로드 실패: ${error}`);
			throw new Error(`파일 업로드 실패: ${error}`);
		}
	}

	async upload(...files: UploadableFileDto[]): Promise<UploadedFileDto[]> {
		const result = await Promise.allSettled(files.map((file) => this.uploadSingleFile(file)));
		return result.filter((res) => res.status === "fulfilled").map((res) => res.value);
	}

	async deleteFile(path: string) {
		const fileBuffer = await this.fileClient.get(path);
		const sha = this.getGitBlobSha(fileBuffer);

		await this.webClient
			.uri(`https://api.github.com/repos/${this.options.owner}/${this.options.repo}/contents/${path}`)
			.delete()
			.body(
				BodyInserter.fromJSON({
					message: "truncated",
					sha, // If the file exists, we need to provide the sha to delete it
				}),
			)
			.retrieve();
	}

	async deleteDirectory(path: string) {
		const files = await this.fileClient.getFilesFromDirectory(path);
		if (files.length === 0) return;

		for (const file of files) {
			await this.deleteFile(file.path);
		}
	}
}
