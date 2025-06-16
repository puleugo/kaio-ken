import path from "node:path";
import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";
import { Metadata } from "@src/module/domain/metadata";
import { PostEntity } from "@src/module/domain/post.entity";
import { ChatGptTranslator } from "@src/module/implemention/driver/chat-gpt.translator";
import { GithubFileReader } from "@src/module/implemention/driver/github-file.reader";
import { GithubFileUploader } from "@src/module/implemention/driver/github-file.uploader";
import { MarkdownParser } from "@src/module/parser/markdown-parser";
import { PostParser } from "@src/module/parser/post-parser";
import { TistoryRssParser } from "@src/module/parser/rss-parser-strategy/tistory-rss-parser";
import { RssParser } from "@src/module/parser/rss.parser";
import { ChatGptClient } from "@src/module/repository/driver/chat-gpt.client";
import { GithubClientImpl } from "@src/module/repository/driver/github-client.impl";
import { TranslatePostsUseCase } from "@src/module/use-case/translate-posts/translate-posts.use-case";
import { BlogMother } from "@test/fixture/blog.mother";
import { ChatGptResponseMother } from "@test/fixture/chat-gpt-response.mother";
import { GithubResponseMother } from "@test/fixture/github-response.mother";
import { PostMother } from "@test/fixture/post.mother";
import { FileClientStub } from "@test/stub/file-client.stub";
import { LoggerStub } from "@test/stub/logger.stub";
import { WebClientStub } from "@test/stub/web-client.stub";
import { MetadataMother } from "../../fixture/metadata.mother";

describe("TranslatePostsUseCase", () => {
	let useCase: TranslatePostsUseCase;
	let logger: LoggerStub;
	let webClient: WebClientStub;
	let fileClient: FileClientStub;
	const githubOptions = { owner: "ownerName", repo: "repoName", token: "", branch: "main" };

	beforeAll(() => {
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
		RssParser.register(BlogPlatform.values.tistory, new TistoryRssParser());
	});

	beforeEach(() => {
		logger = new LoggerStub();
		webClient = new WebClientStub();
		fileClient = new FileClientStub();
		const fileReader = new GithubFileReader(fileClient);
		const aiClient = new ChatGptClient({ apiKey: "" }, webClient, logger);
		const githubClient = new GithubClientImpl(githubOptions, webClient, fileClient, logger);
		useCase = new TranslatePostsUseCase(
			new ChatGptTranslator(aiClient, fileReader, logger),
			new GithubFileUploader(githubClient, logger),
		);
	});

	it("should translate original posts", async () => {
		// Given
		const publisherLanguage = Language.values.English;
		const publisherPostId = 3;
		const subscriberLanguage = Language.values.Korean;
		const originalPost = PostMother.create({
			id: publisherPostId,
			language: publisherLanguage,
		});
		const originalPostPath = PostParser.getPath(publisherLanguage, originalPost.id);

		const metadata = MetadataMother.create(BlogMother.createPublisher(publisherLanguage, publisherPostId), [
			BlogMother.createSubscriber(subscriberLanguage, publisherPostId - 1),
		]);

		// Setup file system
		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			{
				path: originalPostPath,
				filename: path.parse(originalPostPath).base,
				name: path.parse(originalPostPath).name,
				buffer: () => Promise.resolve(MarkdownParser.parseToFile(originalPost).content),
			},
		);

		// Setup API responses
		webClient.pushResponse(
			{ statusCode: 201, body: ChatGptResponseMother.createJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
		);

		// When
		const result = await useCase.execute(metadata);

		// Then
		expect(result.isSucceed).toBe(true);
		expect(webClient.requests).toContainEqual({
			method: "POST",
			url: expect.stringContaining("/chat/completions"),
		});
	});

	it("should upload translated posts to GitHub", async () => {
		// Given
		const publisherLanguage = Language.values.English;
		const publisherPostId = 3;
		const subscriberLanguage = Language.values.Korean;
		const originalPost = PostMother.create({
			id: publisherPostId,
			language: publisherLanguage,
		});
		const originalPostPath = PostParser.getPath(publisherLanguage, originalPost.id);
		const expectedTranslationPath = PostParser.getPath(subscriberLanguage, originalPost.id);

		const metadata = MetadataMother.create(BlogMother.createPublisher(publisherLanguage, publisherPostId), [
			BlogMother.createSubscriber(subscriberLanguage, publisherPostId - 1),
		]);

		// Setup file system
		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			{
				path: originalPostPath,
				filename: path.parse(originalPostPath).base,
				name: path.parse(originalPostPath).name,
				buffer: () => Promise.resolve(MarkdownParser.parseToFile(originalPost).content),
			},
		);

		// Setup API responses
		webClient.pushResponse(
			{ statusCode: 201, body: ChatGptResponseMother.createJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
		);

		// When
		const result = await useCase.execute(metadata);

		// Then
		expect(result.isSucceed).toBe(true);
		expect(webClient.requests).toContainEqual({
			method: "PUT",
			url: expect.stringContaining(
				`/repos/${githubOptions.owner}/${githubOptions.repo}/contents/${expectedTranslationPath}`,
			),
		});
		expect(metadata.subscriberBlogs.getAll()[0].lastPublishedId.toNumber()).toBe(publisherPostId);
	});

	it("should not translate when subscribers field is empty", async () => {
		// Given
		const publisherLanguage = Language.values.English;
		const publisherPostId = 3;
		const originalPost = PostMother.create({
			id: publisherPostId,
			language: publisherLanguage,
		});
		const originalPostPath = PostParser.getPath(publisherLanguage, originalPost.id);

		const metadata = MetadataMother.create(
			BlogMother.createPublisher(publisherLanguage, publisherPostId),
			[], // Empty subscribers list
		);

		// Setup file system
		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			{
				path: originalPostPath,
				filename: path.parse(originalPostPath).base,
				name: path.parse(originalPostPath).name,
				buffer: () => Promise.resolve(MarkdownParser.parseToFile(originalPost).content),
			},
		);

		// When
		const result = await useCase.execute(metadata);

		// Then
		expect(result.isSucceed).toBe(true);
		expect(webClient.requests).not.toContainEqual({
			method: "POST",
			url: expect.stringContaining("/chat/completions"),
		});
		expect(webClient.requests).not.toContainEqual({
			method: "PUT",
			url: expect.stringContaining("/repos/"),
		});
	});

	it("should not translate when subscribers are already up to date", async () => {
		// Given
		const publisherLanguage = Language.values.English;
		const publisherPostId = 3;
		const subscriberLanguage = Language.values.Korean;
		const originalPost = PostMother.create({
			id: publisherPostId,
			language: publisherLanguage,
		});
		const originalPostPath = PostParser.getPath(publisherLanguage, originalPost.id);

		const metadata = MetadataMother.create(
			BlogMother.createPublisher(publisherLanguage, publisherPostId),
			[BlogMother.createSubscriber(subscriberLanguage, publisherPostId)], // Already up to date
		);

		// Setup file system
		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			{
				path: originalPostPath,
				filename: path.parse(originalPostPath).base,
				name: path.parse(originalPostPath).name,
				buffer: () => Promise.resolve(MarkdownParser.parseToFile(originalPost).content),
			},
		);

		// When
		const result = await useCase.execute(metadata);

		// Then
		expect(result.isSucceed).toBe(true);
		expect(webClient.requests).not.toContainEqual({
			method: "POST",
			url: expect.stringContaining("/chat/completions"),
		});
		expect(webClient.requests).not.toContainEqual({
			method: "PUT",
			url: expect.stringContaining("/repos/"),
		});
		expect(metadata.subscriberBlogs.getAll()[0].lastPublishedId.toNumber()).toBe(publisherPostId);
	});

	it("should not translate for unsubscribed blog", async () => {
		// Given
		const publisherLanguage = Language.values.English;
		const publisherPostId = 3;
		const subscriberLanguage = Language.values.Korean;
		const originalPost = PostMother.create({
			id: publisherPostId,
			language: publisherLanguage,
		});
		const originalPostPath = PostParser.getPath(publisherLanguage, originalPost.id);

		const metadata = MetadataMother.create(
			BlogMother.createPublisher(publisherLanguage, publisherPostId),
			[BlogMother.createUnSubscriber(subscriberLanguage, publisherPostId - 2)], // Unsubscribed state
		);

		// Setup file system
		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			{
				path: originalPostPath,
				filename: path.parse(originalPostPath).base,
				name: path.parse(originalPostPath).name,
				buffer: () => Promise.resolve(MarkdownParser.parseToFile(originalPost).content),
			},
		);

		// When
		const result = await useCase.execute(metadata);

		// Then
		expect(result.isSucceed).toBe(true);
		expect(webClient.requests).not.toContainEqual({
			method: "POST",
			url: expect.stringContaining("/chat/completions"),
		});
		expect(webClient.requests).not.toContainEqual({
			method: "PUT",
			url: expect.stringContaining("/repos/"),
		});
		expect(metadata.subscriberBlogs.getAll()[0].lastPublishedId.toNumber()).toBe(publisherPostId - 2);
	});

	it("should translate multiple posts for different subscribers", async () => {
		// Given
		const publisherLanguage = Language.values.English;
		const publisherPostIds = [3, 4, 5];
		const subscriberLanguages = [Language.values.Korean, Language.values.Japanese];

		// Create multiple original posts
		const originalPosts = publisherPostIds.map((id) =>
			PostMother.create({
				id,
				language: publisherLanguage,
			}),
		);

		// Create metadata with multiple subscribers
		const metadata = MetadataMother.create(
			BlogMother.createPublisher(publisherLanguage, Math.max(...publisherPostIds)),
			[
				BlogMother.createSubscriber(subscriberLanguages[0], publisherPostIds[0] - 1), // Korean subscriber
				BlogMother.createSubscriber(subscriberLanguages[1], publisherPostIds[0] - 1), // Japanese subscriber
			],
		);

		// Setup file system for all posts
		const fileEntries = originalPosts.map((post) => ({
			path: PostParser.getPath(publisherLanguage, post.id),
			filename: path.parse(PostParser.getPath(publisherLanguage, post.id)).base,
			name: path.parse(PostParser.getPath(publisherLanguage, post.id)).name,
			buffer: () => Promise.resolve(MarkdownParser.parseToFile(post).content),
		}));

		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			...fileEntries,
		);

		// Setup API responses for multiple translations
		// Each post needs 3 API calls (ChatGPT, GitHub GET, GitHub PUT)
		webClient.pushResponse(
			{ statusCode: 201, body: ChatGptResponseMother.createJson() }, // post id: 3, Korean
			{ statusCode: 201, body: ChatGptResponseMother.createJson() }, // post id: 3, Japanese
			{ statusCode: 201, body: ChatGptResponseMother.createJson() }, // post id: 4, Korean
			{ statusCode: 201, body: ChatGptResponseMother.createJson() }, // post id: 4, Japanese
			{ statusCode: 201, body: ChatGptResponseMother.createJson() }, // post id: 5, Korean
			{ statusCode: 201, body: ChatGptResponseMother.createJson() }, // post id: 5, Japanese

			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },
			{ statusCode: 200, body: GithubResponseMother.createGetResponseJson() },

			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
			{ statusCode: 201, body: GithubResponseMother.createPutResponseJson() },
		);

		// When
		const result = await useCase.execute(metadata);

		// Then
		expect(result.isSucceed).toBe(true);

		// Verify ChatGPT API calls
		const chatGptCalls = webClient.requests.filter(
			(req) => req.method === "POST" && req.url.includes("/chat/completions"),
		);
		expect(chatGptCalls).toHaveLength(publisherPostIds.length * subscriberLanguages.length);

		// Verify GitHub upload calls
		const githubUploadCalls = webClient.requests.filter((req) => req.method === "PUT" && req.url.includes("/repos/"));
		expect(githubUploadCalls).toHaveLength(publisherPostIds.length * subscriberLanguages.length);

		// Verify each subscriber's lastPublishedId is updated
		for (const subscriber of metadata.subscriberBlogs.getAll()) {
			expect(subscriber.lastPublishedId.toNumber()).toBe(Math.max(...publisherPostIds));
		}

		// Verify correct translation paths are used
		for (const postId of publisherPostIds) {
			for (const language of subscriberLanguages) {
				const expectedPath = PostParser.getPath(language, UniqueEntityId.create(postId));
				expect(githubUploadCalls).toContainEqual(
					expect.objectContaining({
						method: "PUT",
						url: expect.stringContaining(
							`/repos/${githubOptions.owner}/${githubOptions.repo}/contents/${expectedPath}`,
						),
					}),
				);
			}
		}
	});

	it.todo("should handle partial translation success for multiple posts");
});
