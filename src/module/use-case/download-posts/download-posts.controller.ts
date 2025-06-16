import type { Metadata } from "@src/module/domain/metadata";
import type { Sitemap } from "@src/module/domain/sitemap";
import type { DownloadPostsUseCase } from "@src/module/use-case/download-posts/download-posts.use-case";
import { BaseGithubActionController } from "@src/shared/infra/github-action/base-github-action-controller";

export class DownloadPostsController extends BaseGithubActionController {
	constructor(private readonly useCase: DownloadPostsUseCase) {
		super();
	}

	protected async executeUseCase(metadata: Metadata, sitemap: Sitemap): Promise<void> {
		try {
			const result = await this.useCase.execute(metadata, sitemap);

			if (result.isFailed) return this.fail(result.getFailure());

			return this.complete();
		} catch (e: unknown) {
			// TODO: 예외처리
			return this.fail(e);
		}
	}
}
