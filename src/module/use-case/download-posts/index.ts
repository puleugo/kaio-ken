import { githubFileUploader, rssSearcher } from "@src/module/implemention";
import { DownloadPostsController } from "@src/module/use-case/download-posts/download-posts.controller";
import { DownloadPostsUseCase } from "@src/module/use-case/download-posts/download-posts.use-case";

const downloadPostsUseCase = new DownloadPostsUseCase(githubFileUploader, rssSearcher);
export const downloadPostsController = new DownloadPostsController(downloadPostsUseCase);
