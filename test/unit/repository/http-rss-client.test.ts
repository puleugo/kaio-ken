import { BlogPlatform } from "@src/module/domain/blog-platform";
import { TistoryRssParser } from "@src/module/parser/rss-parser-strategy/tistory-rss-parser";
import { RssParser } from "@src/module/parser/rss.parser";
import { HttpRssClient } from "@src/module/repository/driver/http-rss.client";
import { BlogMother } from "@test/fixture/blog.mother";
import { RssMother } from "@test/fixture/rss.mother";
import { LoggerStub } from "@test/stub/logger.stub";
import { WebClientStub } from "@test/stub/web-client.stub";

describe("HttpRssClient", () => {
	let client: HttpRssClient;
	let webClient: WebClientStub;
	let logger: LoggerStub;

	beforeEach(() => {
		webClient = new WebClientStub();
		logger = new LoggerStub();
		client = new HttpRssClient(logger, webClient);
		RssParser.register(BlogPlatform.values.tistory, new TistoryRssParser());
	});

	describe("readPosts", () => {
		it("should throw error if blog type is not publisher", async () => {
			const blog = BlogMother.createSubscriber();

			await expect(client.readPosts(blog)).rejects.toThrow(
				`Subscriber Blog(1, Subscriber Blog) blog type is not 'PUBLISHER'`,
			);
		});

		it("should successfully read posts from RSS feed", async () => {
			const blog = BlogMother.createPublisher();
			const xml = RssMother.createResponseXml();
			webClient.pushResponse(200, xml);

			const posts = await client.readPosts(blog);

			expect(webClient.urls[0]).toBe(blog.rssUrl?.toString());
			expect(posts).toBeDefined();
			expect(Array.isArray(posts)).toBe(true);
			expect(posts.length).toBeGreaterThan(0);
		});

		it("should log debug messages", async () => {
			const blog = BlogMother.createPublisher();
			const xml = RssMother.createResponseXml();
			webClient.pushResponse(200, xml);

			await client.readPosts(blog);

			expect(logger.debugCount).toBe(2);
		});
	});
});
