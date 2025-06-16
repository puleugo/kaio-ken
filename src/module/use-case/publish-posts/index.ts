import { githubFileReader, translationUploader } from "../../implemention";
import { PublishPostsController } from "./publish-posts.controller";
import { PublishPostsUseCase } from "./publish-posts.use-case";

const publishPostsUseCase = new PublishPostsUseCase(githubFileReader, translationUploader);
export const publishPostsController = new PublishPostsController(publishPostsUseCase);
