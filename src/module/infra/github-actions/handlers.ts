import { downloadPostsController } from "@src/module/use-case/download-posts";
import { Handlers } from "@src/shared/infra/github-action/handlers";

const handlers = new Handlers();

handlers.register("READ", downloadPostsController.execute);
// handlers.register("TRANSLATE", translatePostsController.execute);
// handlers.register("PUBLISH", publishPostsController.execute);

export { handlers };
