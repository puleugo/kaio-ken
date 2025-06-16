import { setupAutoIncrementIds } from "@src/module/infra/github-actions/auto-increament-id-reader";
import { handlers } from "@src/module/infra/github-actions/handlers";
import { setupBlogUploader } from "@src/module/infra/github-actions/setup-blog-uploader";
import { setupMetadata } from "@src/module/infra/github-actions/setup-metadata";
import { GithubActionRunner } from "@src/shared/infra/github-action/github-action-runner";

GithubActionRunner.addBootstrapHandler(setupMetadata);
GithubActionRunner.addBootstrapHandler(setupAutoIncrementIds);
GithubActionRunner.addBootstrapHandler(setupBlogUploader);
GithubActionRunner.addHandlers(handlers);
const githubActionRunner = new GithubActionRunner();

async function bootstrap() {
	await githubActionRunner.runBootstrapHandlers();
	await githubActionRunner.runHandlers();
}

bootstrap();
