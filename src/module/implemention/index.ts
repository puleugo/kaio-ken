import { actionLogger, chatGptClient, githubClient, rssClient } from "../repository";
import { FileSystemFileClient } from "../repository/driver/file-system.file-client";
import { ChatGptTranslator } from "./driver/chat-gpt.translator";
import { GithubFileReader } from "./driver/github-file.reader";
import { GithubFileUploader } from "./driver/github-file.uploader";
import { HttpRssSearcher } from "./driver/http-rss.searcher";
import { TranslationGithubUploader } from "./driver/translation-github-uploader";

export const githubFileReader = new GithubFileReader(new FileSystemFileClient());
export const githubFileUploader = new GithubFileUploader(githubClient, actionLogger);
export const chatGptTranslator = new ChatGptTranslator(chatGptClient, githubFileReader, actionLogger);
export const rssSearcher = new HttpRssSearcher(rssClient, githubFileReader);
export const translationUploader = new TranslationGithubUploader();
