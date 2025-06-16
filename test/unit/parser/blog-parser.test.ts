import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { BlogType } from "@src/module/domain/blog-type";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { BlogParser } from "@src/module/parser/blog-parser";

describe("BlogParser", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
	});

	describe("parse", () => {
		it("should create a valid BlogEntity for a publisher blog", () => {
			const props = {
				title: "Test Blog",
				url: "https://example.com",
				rssUrl: "https://example.com/rss",
				language: "en",
				platform: "medium",
				type: BlogType.PUBLISHER,
			};

			const blog = BlogParser.parse(props);
			expect(blog).toBeInstanceOf(BlogEntity);
			expect(blog.title.toString()).toBe("Test Blog");
			expect(blog.url.toString()).toBe("https://example.com/");
			expect(blog.rssUrl?.toString()).toBe("https://example.com/rss");
			expect(blog.language.toString()).toBe("en");
			expect(blog.platform.toString()).toBe("medium");
			expect(blog.type.toString()).toBe("PUBLISHER");
		});

		it("should create a valid BlogEntity for a subscriber blog", () => {
			const props = {
				title: "Test Blog",
				url: "https://example.com",
				language: "en",
				platform: "medium",
				type: BlogType.SUBSCRIBER,
			};

			const blog = BlogParser.parse(props);
			expect(blog).toBeInstanceOf(BlogEntity);
			expect(blog.title.toString()).toBe("Test Blog");
			expect(blog.url.toString()).toBe("https://example.com/");
			expect(blog.rssUrl).toBeUndefined();
			expect(blog.language.toString()).toBe("en");
			expect(blog.platform.toString()).toBe("medium");
			expect(blog.type.toString()).toBe("SUBSCRIBER");
		});

		it("should throw error for missing required fields", () => {
			const props = {
				title: "",
				url: "",
				language: "",
				platform: "",
				type: BlogType.PUBLISHER,
			};

			expect(() => BlogParser.parse(props)).toThrow();
		});

		it("should throw error for invalid URL", () => {
			const props = {
				title: "Test Blog",
				url: "invalid-url",
				language: "en",
				platform: "medium",
				type: BlogType.PUBLISHER,
			};

			expect(() => BlogParser.parse(props)).toThrow();
		});

		it("should throw error for invalid platform", () => {
			const props = {
				title: "Test Blog",
				url: "https://example.com",
				language: "en",
				platform: "invalid-platform",
				type: BlogType.PUBLISHER,
			};

			expect(() => BlogParser.parse(props)).toThrow();
		});

		it("should throw error for invalid language", () => {
			const props = {
				title: "Test Blog",
				url: "https://example.com",
				language: "invalid-language",
				platform: "medium",
				type: BlogType.PUBLISHER,
			};

			expect(() => BlogParser.parse(props)).toThrow();
		});

		it("should throw error for publisher blog without RSS URL", () => {
			const props = {
				title: "Test Blog",
				url: "https://example.com",
				language: "en",
				platform: "medium",
				type: BlogType.PUBLISHER,
			};

			expect(() => BlogParser.parse(props)).toThrow();
		});
	});
});
