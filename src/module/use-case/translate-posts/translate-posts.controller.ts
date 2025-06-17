import type { Metadata } from "@src/module/domain/metadata";
import type { TranslatePostsUseCase } from "@src/module/use-case/translate-posts/translate-posts.use-case";
import { BaseGithubActionController } from "@src/shared/infra/github-action/base-github-action-controller";

export class TranslatePostsController extends BaseGithubActionController {
	constructor(private readonly useCase: TranslatePostsUseCase) {
		super();
	}

	protected async executeUseCase(metadata: Metadata): Promise<void> {
		try {
			const result = await this.useCase.execute(metadata);
			if (result.isFailed) return this.fail(result.getFailure());

			return this.complete();
		} catch (e: unknown) {
			return this.fail(e);
		}
	}
}
