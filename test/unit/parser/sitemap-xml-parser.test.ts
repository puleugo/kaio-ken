import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogTitle } from "@src/module/domain/blog-title";
import { BlogType } from "@src/module/domain/blog-type";
import { BlogUrl } from "@src/module/domain/blog-url";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { PostUrl } from "@src/module/domain/post-url";
import { PostEntity } from "@src/module/domain/post.entity";
import { Translation } from "@src/module/domain/translation";
import { TranslationMap } from "@src/module/domain/translation-map";
import { SitemapXmlParser } from "@src/module/parser/sitemap-xml-parser";

describe("SitemapXmlParser", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
	});

	describe("parseBlogUrl", () => {
		it("should create a valid URL tag for a blog", () => {
			const blogUrl = BlogUrl.from("https://example.com").getValue();
			const blogTitle = BlogTitle.create("Test Blog").getValue();
			const blogType = BlogType.create("SUBSCRIBER").getValue();
			const blogPlatform = BlogPlatform.from("medium").getValue();
			const language = Language.from("en").getValue();

			const blog = BlogEntity.create({
				url: blogUrl,
				title: blogTitle,
				type: blogType,
				platform: blogPlatform,
				language,
			}).getValue();

			const urlTag = SitemapXmlParser.parseBlogUrl(blog);
			expect(urlTag.location.toString()).toBe("https://example.com/");
		});
	});

	describe("parseTranslationUrl", () => {
		it("should create a valid XHTML tag for a translation", () => {
			const originalUrl = new URL("https://example.com/post");
			const language = Language.from("en").getValue();
			const translationUrl = PostUrl.from("https://example.com/en/post").getValue();

			const translation = Translation.create({
				language,
				url: translationUrl,
				postId: UniqueEntityId.create(1),
				title: PostTitle.from("Test Post").getValue(),
				content: PostContent.from("Test content").getValue(),
				uploadedAt: PostUploadedDate.from(new Date()).getValue(),
			}).getValue();

			const xhtmlTag = SitemapXmlParser.parseTranslationUrl(originalUrl, translation);
			expect(xhtmlTag.location.toString()).toBe("https://example.com/post");
		});

		it("should throw error for unuploaded post", () => {
			const originalUrl = new URL("https://example.com/post");
			const language = Language.from("en").getValue();

			const translation = Translation.create({
				language,
				url: null,
				postId: UniqueEntityId.create(1),
				title: PostTitle.from("Test Post").getValue(),
				content: PostContent.from("Test content").getValue(),
				uploadedAt: PostUploadedDate.from(new Date()).getValue(),
			}).getValue();

			expect(() => SitemapXmlParser.parseTranslationUrl(originalUrl, translation)).toThrow(
				"Unuploaded post cannot parse to xml tag",
			);
		});
	});

	describe("parsePostUrl", () => {
		it("should create a valid URL tag for a post with translations", () => {
			const postUrl = PostUrl.from("https://example.com/post").getValue();
			const language = Language.from("en").getValue();
			const translationUrl = PostUrl.from("https://example.com/en/post").getValue();

			const translation = Translation.create({
				language,
				url: translationUrl,
				postId: UniqueEntityId.create(1),
				title: PostTitle.from("Test Post").getValue(),
				content: PostContent.from("Test content").getValue(),
				uploadedAt: PostUploadedDate.from(new Date()).getValue(),
			}).getValue();

			const translations = new TranslationMap(new Map([[language, translation]]));

			const post = PostEntity.create({
				url: postUrl,
				title: PostTitle.from("Test Post").getValue(),
				content: PostContent.from("Test content").getValue(),
				uploadedAt: PostUploadedDate.from(new Date()).getValue(),
				language,
				translations,
			}).getValue();

			const urlTag = SitemapXmlParser.parsePostUrl(post);
			expect(urlTag.location.toString()).toBe("https://example.com/post");
		});
	});

	describe("fromString", () => {
		it("should parse a valid sitemap XML string", () => {
			const rawXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<url>
		<loc>https://example.com/post1</loc>
		<lastmod>2024-03-20</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
		<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/post1" />
	</url>
</urlset>`;

			const sitemap = SitemapXmlParser.fromString(rawXml);
			expect(sitemap.urlSet).toBeDefined();
		});

		it("should throw error for invalid XML format", () => {
			const invalidXml = "invalid xml";
			expect(() => SitemapXmlParser.fromString(invalidXml)).toThrow("Invalid XML format");
		});

		it("should throw error for missing required elements", () => {
			const incompleteXml = `<?xml version="1.0" encoding="UTF-8"?>`;
			expect(() => SitemapXmlParser.fromString(incompleteXml)).toThrow("Invalid XML format");
		});
	});
});
