import type { Metadata } from "@src/module/domain/metadata";
import type { Sitemap } from "@src/module/domain/sitemap";
import { PublishPostsExceptions } from "@src/module/use-case/publish-posts/publish-posts.exception";
import type { PublishPostsUseCase } from "@src/module/use-case/publish-posts/publish-posts.use-case";
import { BaseGithubActionController } from "@src/shared/infra/github-action/base-github-action-controller";

export class PublishPostsController extends BaseGithubActionController {
	constructor(private readonly useCase: PublishPostsUseCase) {
		super();
	}

	protected async executeUseCase(metadata: Metadata, sitemap: Sitemap): Promise<void> {
		try {
			const result = await this.useCase.execute(metadata, sitemap);

			if (result.isFailed) {
				const exception = result.getFailure();

				switch (exception.constructor) {
					case PublishPostsExceptions.PublishNotSupportedPlatformException:
						return this.clientError(exception.getReason());
					default:
						return this.fail("An unexpected error occurred.");
				}
			}

			return this.complete();
		} catch (error: unknown) {
			return this.fail(error);
		}
	}
}
