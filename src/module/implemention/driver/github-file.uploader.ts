import { Metadata } from "@src/module/domain/metadata";
import type { Posts } from "@src/module/domain/posts";
import { Sitemap } from "@src/module/domain/sitemap";
import type { Translations } from "@src/module/domain/translations";
import type { UploadableFileDto } from "@src/module/dto/uploadable-file.dto";
import type { FileUploader } from "@src/module/implemention/file.uploader";
import { MarkdownParser } from "@src/module/parser/markdown-parser";
import type { GithubClient } from "@src/module/repository/file.repository";
import type { Logger } from "@src/module/repository/logger";

export class GithubFileUploader implements FileUploader {
	constructor(
		private readonly githubClient: GithubClient,
		private readonly logger: Logger,
	) {}

	async updateSitemap(sitemap: Sitemap): Promise<void> {
		const content = Buffer.from(sitemap.toString());
		await this.githubClient.upload({ path: Sitemap.PATH, content: content });
		this.logger.debug("Sitemap updated");
	}
	async updateMetadata(metadata: Metadata): Promise<void> {
		const content = Buffer.from(metadata.toString());
		await this.githubClient.upload({ path: Metadata.PATH, content: content });
		this.logger.debug("Metadata updated");
	}

	async uploadPosts(posts: Posts): Promise<void> {
		this.logger.debug("Post upload start");
		const files = posts.getAll().flatMap(MarkdownParser.parseToFiles);
		await this.githubClient.upload(...files);
		this.logger.debug("Post upload complete");
	}

	async uploadFile(file: UploadableFileDto): Promise<void> {
		this.logger.debug("File upload start");
		await this.githubClient.upload(file);
	}

	async uploadTranslations(translations: Translations): Promise<void> {
		this.logger.debug("Translation upload start");
		const files = translations.getAll().flatMap(MarkdownParser.parseToFiles);
		await this.githubClient.upload(...files);
		this.logger.debug("Translation upload complete");
	}
}
