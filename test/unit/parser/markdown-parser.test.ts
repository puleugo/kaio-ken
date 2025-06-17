import { PostEntity } from "@src/module/domain/post.entity";
import { TranslationMap } from "@src/module/domain/translation-map";
import { MarkdownParser } from "@src/module/parser/markdown-parser";
import { PostParser } from "@src/module/parser/post-parser";

describe("MarkdownParser", () => {
	describe("parseFromMarkdown", () => {
		it("should parse valid markdown with front matter", () => {
			const markdown = `---
title: Test Post
uploadedAt: 2024-03-20
url: https://example.com/post
language: en
---
This is the content of the post.`;

			const result = MarkdownParser.parseFromMarkdown(markdown);
			expect(result.frontMatter).toEqual({
				title: "Test Post",
				uploadedAt: "2024-03-20",
				url: "https://example.com/post",
				language: "en",
			});
			expect(result.content).toBe("This is the content of the post.");
		});

		it("should parse markdown with empty content", () => {
			const markdown = `---
title: Test Post
uploadedAt: 2024-03-20
url: https://example.com/post
language: en
---`;

			const result = MarkdownParser.parseFromMarkdown(markdown);
			expect(result.frontMatter).toEqual({
				title: "Test Post",
				uploadedAt: "2024-03-20",
				url: "https://example.com/post",
				language: "en",
			});
			expect(result.content).toBe("");
		});

		it("should throw error for markdown without front matter", () => {
			const markdown = "This is a post without front matter.";
			expect(() => MarkdownParser.parseFromMarkdown(markdown)).toThrow("Invalid markdown format");
		});

		it("should throw error for markdown with invalid front matter format", () => {
			const markdown = `---
title: Test Post
uploadedAt: 2024-03-20
url: https://example.com/post
language: en
This is invalid front matter.`;

			expect(() => MarkdownParser.parseFromMarkdown(markdown)).toThrow("Invalid markdown format");
		});

		it("should parse markdown with complex front matter", () => {
			const markdown = `---
title: Test Post
uploadedAt: 2024-03-20
url: https://example.com/post
language: en
tags:
  - tag1
  - tag2
categories:
  - category1
  - category2
---
This is the content of the post.`;

			const result = MarkdownParser.parseFromMarkdown(markdown);
			expect(result.frontMatter).toEqual({
				title: "Test Post",
				uploadedAt: "2024-03-20",
				url: "https://example.com/post",
				language: "en",
				tags: ["tag1", "tag2"],
				categories: ["category1", "category2"],
			});
			expect(result.content).toBe("This is the content of the post.");
		});
	});

	describe("parseToFiles", () => {
		it("should create valid file DTOs for a post", () => {
			const post = PostParser.parse({
				title: "Test Post",
				uploadedAt: new Date(),
				url: "https://example.com/post",
				language: "en",
				content: "Test content",
			});

			const files = MarkdownParser.parseToFiles(post);
			expect(files).toHaveLength(1);
			expect(files[0].path).toMatch(/^posts\/en\/\d+\.md$/);
			expect(files[0].commitMessage).toBe("cron(kaioken): Upload post");
		});

		it("should create file DTOs for post with translations", () => {
			const post = PostParser.parse({
				title: "Test Post",
				uploadedAt: new Date(),
				url: "https://example.com/post",
				language: "en",
				content: "Test content",
			});

			const translation = PostParser.parseToTranslation(
				{
					title: "Test Translation",
					uploadedAt: new Date(),
					url: "https://example.com/translation",
					language: "ko-KR",
					content: "Test translation content",
				},
				post.id,
			);

			const translations = new Map([[translation.language, translation]]);
			const postWithTranslations = PostEntity.create({
				title: post.title,
				content: post.content,
				uploadedAt: post.uploadedAt,
				url: post.url,
				language: post.language,
				translations: new TranslationMap(translations),
			}).getValue();

			const files = MarkdownParser.parseToFiles(postWithTranslations);
			expect(files).toHaveLength(2); // One for post, one for translation
			expect(files[0].path).toMatch(/^posts\/en\/\d+\.md$/);
			expect(files[1].path).toMatch(/^posts\/ko-KR\/\d+\.md$/);
		});
	});
});
