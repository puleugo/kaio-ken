import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { EitherResult } from "@src/core/either-result";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogTitle } from "@src/module/domain/blog-title";
import { BlogType } from "@src/module/domain/blog-type";
import { BlogUrl } from "@src/module/domain/blog-url";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";
import type { Metadata } from "@src/module/domain/metadata";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { PostUrl } from "@src/module/domain/post-url";
import { PostEntity } from "@src/module/domain/post.entity";
import { Posts } from "@src/module/domain/posts";
import type { Sitemap } from "@src/module/domain/sitemap";
import { TranslationMap } from "@src/module/domain/translation-map";
import type { Translations } from "@src/module/domain/translations";
import type { UploadableFileDto } from "@src/module/dto/uploadable-file.dto";
import type { FileUploader } from "@src/module/implemention/file.uploader";
import type { RssSearcher } from "@src/module/implemention/rss.searcher";
import { DownloadPostsUseCase } from "@src/module/use-case/download-posts/download-posts.use-case";
import { SitemapMother } from "../../fixture/sitemap.mother";

class TestFileUploader implements FileUploader {
	private uploadedPosts: Posts | null = null;

	async uploadPosts(posts: Posts): Promise<void> {
		this.uploadedPosts = posts;
	}

	async uploadTranslations(translations: Translations): Promise<void> {}
	async updateSitemap(sitemap: Sitemap): Promise<void> {}
	async updateMetadata(metadata: Metadata): Promise<void> {}
	async uploadFile(file: UploadableFileDto): Promise<void> {}

	getUploadedPosts(): Posts | null {
		return this.uploadedPosts;
	}
}

class TestRssSearcher implements RssSearcher {
	private posts: Posts | null = null;

	setPosts(posts: Posts): void {
		this.posts = posts;
	}

	async searchUnuploadedPosts(blog: BlogEntity): Promise<Posts> {
		return this.posts || Posts.create([]);
	}

	async readBlog(id: UniqueEntityId): Promise<BlogEntity> {
		const platform = BlogPlatform.from("medium").getValue();
		const language = Language.from("en").getValue();
		const title = BlogTitle.create("Test Blog").getValue();
		const url = BlogUrl.from("https://example.com").getValue();
		const rssUrl = BlogUrl.from("https://example.com/rss").getValue();

		return BlogEntity.create({
			platform,
			language,
			title,
			url,
			rssUrl,
			type: BlogType.PUBLISHER,
			lastPublishedId: UniqueEntityId.create(0),
		}).getValue();
	}
}

describe("DownloadPostsUseCase", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
	});

	let useCase: DownloadPostsUseCase;
	let fileUploader: TestFileUploader;
	let rssSearcher: TestRssSearcher;
	let metadata: Metadata;
	let sitemap: Sitemap;

	beforeEach(() => {
		fileUploader = new TestFileUploader();
		rssSearcher = new TestRssSearcher();

		const platform = BlogPlatform.from("medium").getValue();
		const language = Language.from("en").getValue();
		const title = BlogTitle.create("Test Blog").getValue();
		const url = BlogUrl.from("https://example.com").getValue();
		const rssUrl = BlogUrl.from("https://example.com/rss").getValue();

		const publisher = BlogEntity.create({
			platform,
			language,
			title,
			url,
			rssUrl,
			type: BlogType.PUBLISHER,
			lastPublishedId: UniqueEntityId.create(0),
		}).getValue();

		metadata = {
			publisher,
			blogs: {
				getAll: () => [publisher],
				getSubscribers: () => [],
			},
			toJson: () => ({}),
			props: {},
			equals: () => false,
		} as unknown as Metadata;

		sitemap = SitemapMother.createByMetadata(metadata);

		useCase = new DownloadPostsUseCase(fileUploader, rssSearcher);
	});

	it("should not upload posts when no posts are found", async () => {
		const result = await useCase.execute(metadata, sitemap);

		expect(result).toBeInstanceOf(EitherResult);
		expect(fileUploader.getUploadedPosts()).toBeNull();
	});

	it("should upload posts and update sitemap when posts are found", async () => {
		const title = PostTitle.from("Test Post").getValue();
		const content = PostContent.from("Test Content").getValue();
		const uploadedAt = PostUploadedDate.now();
		const url = PostUrl.from("https://example.com/post").getValue();
		const language = Language.from("en").getValue();

		const post = PostEntity.create({
			title,
			content,
			uploadedAt,
			url,
			language,
			translations: new TranslationMap(),
		}).getValue();

		const posts = Posts.create([post]);
		rssSearcher.setPosts(posts);

		const result = await useCase.execute(metadata, sitemap);

		expect(result).toBeInstanceOf(EitherResult);
		expect(fileUploader.getUploadedPosts()).toBe(posts);
	});
});
