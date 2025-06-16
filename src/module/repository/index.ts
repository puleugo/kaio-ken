import { authConfig } from "@src/config/auth.config";
import { AxiosClient } from "@src/module/repository/driver/axios-client";
import { ChatGptClient } from "@src/module/repository/driver/chat-gpt.client";
import { FileSystemFileClient } from "@src/module/repository/driver/file-system.file-client";
import { GithubActionLogger } from "@src/module/repository/driver/github-action.logger";
import { GithubClientImpl } from "@src/module/repository/driver/github-client.impl";
import { HttpRssClient } from "@src/module/repository/driver/http-rss.client";

export const actionLogger = new GithubActionLogger();
export const githubClient = new GithubClientImpl(
	{
		owner: authConfig.GH_USER,
		repo: authConfig.GH_REPOSITORY,
		token: authConfig.GH_TOKEN,
		branch: "main",
	},
	new AxiosClient(),
	new FileSystemFileClient(),
	actionLogger,
);
export const rssClient = new HttpRssClient(actionLogger, new AxiosClient());
export const chatGptClient = new ChatGptClient(
	{
		apiKey: authConfig.OPENAI_API_KEY,
	},
	new AxiosClient(),
	actionLogger,
);
