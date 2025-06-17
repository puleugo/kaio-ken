import { UseCaseException } from "@src/core/use-case.exception";
import type { Metadata } from "@src/module/domain/metadata";
import type { Sitemap } from "@src/module/domain/sitemap";
import { githubFileReader, githubFileUploader } from "@src/module/implemention";
import type { FileReader } from "@src/module/implemention/file.reader";
import type { FileUploader } from "@src/module/implemention/file.uploader";
import { actionLogger } from "@src/module/repository";
import type { Logger } from "@src/module/repository/logger";

export abstract class BaseGithubActionController {
	protected constructor(
		private readonly logger: Logger = actionLogger,
		private readonly fileReader: FileReader = githubFileReader,
		private readonly fileUploader: FileUploader = githubFileUploader,
	) {}

	protected abstract executeUseCase(metadata?: Metadata, sitemap?: Sitemap): Promise<void>;

	async execute(): Promise<void> {
		try {
			const [metadata, sitemap] = await Promise.all([this.fileReader.findMetadata(), this.fileReader.findSitemap()]);
			if (!metadata) return this.clientError("Metadata not found");
			if (!sitemap) return this.clientError("Sitemap not found");

			await this.executeUseCase(metadata, sitemap);

			await Promise.all([this.fileUploader.updateMetadata(metadata), this.fileUploader.updateSitemap(sitemap)]);
		} catch (err) {
			this.logger.error("[BaseController]: Uncaught controller error");
			if (err instanceof Error) {
				this.logger.error(err.message);
				if (err.stack) this.logger.error(err.stack);
			}
			this.fail("An unexpected error occurred");
		}
	}

	protected complete() {
		this.logger.info("Completed successfully");
	}

	protected clientError(error: UseCaseException | string) {
		if (error instanceof UseCaseException) {
			return this.logger.error(error.message);
		}
		this.logger.error(error);
	}

	protected fail(error: UseCaseException | string | unknown) {
		if (error instanceof UseCaseException) {
			return this.logger.error(error.message);
		}
		if (error instanceof Error) {
			this.logger.error(error.message);
			if (error.stack) this.logger.error(error.stack);
			return;
		}
	}
}
