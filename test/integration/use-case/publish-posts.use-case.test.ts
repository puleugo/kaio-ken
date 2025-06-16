import path from "node:path";
import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { EitherResult } from "@src/core/either-result";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Blogs } from "@src/module/domain/blogs";
import { Metadata } from "@src/module/domain/metadata";
import { PostEntity } from "@src/module/domain/post.entity";
import { Sitemap } from "@src/module/domain/sitemap";
import type { Translation } from "@src/module/domain/translation";
import type { Translations } from "@src/module/domain/translations";
import { GithubFileReader } from "@src/module/implemention/driver/github-file.reader";
import type { TranslationUploader } from "@src/module/implemention/translation-uploader";
import { PublishPostsUseCase } from "@src/module/use-case/publish-posts/publish-posts.use-case";
import { BlogMother } from "@test/fixture/blog.mother";
import { SitemapMother } from "@test/fixture/sitemap.mother";
import { FileClientStub } from "@test/stub/file-client.stub";

class TranslationUploaderStub implements TranslationUploader {
	private map: Map<string, Translation[]> = new Map();

	async uploadMany(subscriber: BlogEntity, translations: Translations): Promise<void> {
		if (!this.map.has(subscriber.id.toString())) {
			this.map.set(subscriber.id.toString(), []);
		}
		this.map.get(subscriber.id.toString())?.push(...translations.getAll());
	}
}
describe("PublishPostsUseCase", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
	});

	let useCase: PublishPostsUseCase;
	let fileClient: FileClientStub;
	let translationUploader: TranslationUploaderStub;
	let metadata: Metadata;
	let sitemap: Sitemap;
	let publisher: BlogEntity;

	beforeEach(() => {
		fileClient = new FileClientStub();
		translationUploader = new TranslationUploaderStub();

		useCase = new PublishPostsUseCase(new GithubFileReader(fileClient), translationUploader);
	});

	it("should skip unsubscribed blogs", async () => {
		const publisher = BlogMother.createPublisher();
		const subscriber = BlogMother.createSubscriber();
		const unSubscriber = BlogMother.createSubscriber();

		metadata = Metadata.from({ publisher, blogs: Blogs.of([subscriber, unSubscriber]).getValue() }).getValue();
		sitemap = SitemapMother.createByMetadata(metadata);

		fileClient.setFile(
			{
				path: Metadata.PATH,
				filename: Metadata.PATH,
				name: path.parse(Metadata.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(metadata.toString())),
			},
			{
				path: Sitemap.PATH,
				filename: Sitemap.PATH,
				name: path.parse(Sitemap.PATH).name,
				buffer: () => Promise.resolve(Buffer.from(sitemap.toString())),
			},
		);

		const result = await useCase.execute(metadata, sitemap);

		expect(result).toBeInstanceOf(EitherResult);
		expect(result.isSucceed).toBe(true);
		// expect(result.getValue().effected).toBe();
		// const urlTag = UrlTag.create({ location: new URL("https://example.com/unsubscribed") }).getValue();
		// expect(sitemap.urlSet.contains(urlTag)).toBe(false);
	});

	// it("should process subscribed blogs with new translations", async () => {
	// 	const title = PostTitle.from("Test Post").getValue();
	// 	const content = PostContent.from("Test Content").getValue();
	// 	const uploadedAt = PostUploadedDate.now();
	// 	const url = PostUrl.from("https://example.com/post").getValue();
	// 	const language = Language.from("en").getValue();
	//
	// 	const post = PostEntity.create({
	// 		title,
	// 		content,
	// 		uploadedAt,
	// 		url,
	// 		language,
	// 		translations: new TranslationMap(),
	// 	}).getValue();
	//
	// 	const translation = Translation.create({
	// 		postId: post.id,
	// 		title,
	// 		language,
	// 		content,
	// 		uploadedAt,
	// 		url,
	// 	}).getValue();
	//
	// 	fileReader.setPost(post);
	// 	fileReader.setTranslations(Translations.create([translation]));
	//
	// 	const result = await useCase.execute(metadata, sitemap);
	//
	// 	expect(result).toBeInstanceOf(EitherResult);
	// 	const urlTag = UrlTag.create({ location: url.toUrl() }).getValue();
	// 	expect(sitemap.urlSet.contains(urlTag)).toBe(true);
	// });
});
