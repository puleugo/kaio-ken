import { chatGptTranslator, githubFileUploader } from "../../implemention";
import { TranslatePostsController } from "./translate-posts.controller";
import { TranslatePostsUseCase } from "./translate-posts.use-case";

const translatePostsUseCase = new TranslatePostsUseCase(chatGptTranslator, githubFileUploader);
export const translatePostsController = new TranslatePostsController(translatePostsUseCase);
