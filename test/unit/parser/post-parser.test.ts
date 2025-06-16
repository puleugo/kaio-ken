import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { PostEntity } from "@src/module/domain/post.entity";
import { Translation } from "@src/module/domain/translation";
import { PostParser } from "@src/module/parser/post-parser";

describe("PostParser", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
	});

	describe("parse", () => {
		it("should create a valid PostEntity from valid props", () => {
			const props = {
				title: "Test Post",
				uploadedAt: new Date(),
				url: "https://example.com/post",
				language: "en",
				content: "Test content",
			};

			const post = PostParser.parse(props);
			expect(post).toBeInstanceOf(PostEntity);
			expect(post.title.toString()).toBe("Test Post");
			expect(post.url.toString()).toBe("https://example.com/post");
			expect(post.language.toString()).toBe("en");
			expect(post.content.toString()).toBe("Test content");
		});

		it("should throw error for invalid title", () => {
			const props = {
				title: "", // Invalid empty title
				uploadedAt: new Date(),
				url: "https://example.com/post",
				language: "en",
				content: "Test content",
			};

			expect(() => PostParser.parse(props)).toThrow();
		});

		it("should throw error for invalid URL", () => {
			const props = {
				title: "Test Post",
				uploadedAt: new Date(),
				url: "invalid-url",
				language: "en",
				content: "Test content",
			};

			expect(() => PostParser.parse(props)).toThrow();
		});

		it("should throw error for invalid language", () => {
			const props = {
				title: "Test Post",
				uploadedAt: new Date(),
				url: "https://example.com/post",
				language: "invalid-language",
				content: "Test content",
			};

			expect(() => PostParser.parse(props)).toThrow();
		});
	});

	describe("parseToTranslation", () => {
		it("should create a valid Translation from valid props", () => {
			const postId = UniqueEntityId.create(1);
			const props = {
				title: "Test Translation",
				uploadedAt: new Date(),
				url: "https://example.com/translation",
				language: "ko-KR",
				content: "Test translation content",
			};

			const translation = PostParser.parseToTranslation(props, postId);
			expect(translation).toBeInstanceOf(Translation);
			expect(translation.title.toString()).toBe("Test Translation");
			expect(translation.url?.toString()).toBe("https://example.com/translation");
			expect(translation.language.toString()).toBe("ko-KR");
			expect(translation.content.toString()).toBe("Test translation content");
		});

		it("should create translation with null URL and uploadedAt", () => {
			const postId = UniqueEntityId.create(1);
			const props = {
				title: "Test Translation",
				uploadedAt: null,
				url: null,
				language: "ko-KR",
				content: "Test translation content",
			};

			const translation = PostParser.parseToTranslation(props, postId);
			expect(translation.url).toBeNull();
		});
	});
});
