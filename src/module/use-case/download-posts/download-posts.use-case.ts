import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { EitherResult } from "@src/core/either-result";
import type { UseCase } from "@src/core/use-case";
import { BlogPublishedId } from "@src/module/domain/blog-published-id";
import type { Metadata } from "@src/module/domain/metadata";
import { PostEntity } from "@src/module/domain/post.entity";
import type { Sitemap } from "@src/module/domain/sitemap";
import type { FileUploader } from "@src/module/implemention/file.uploader";
import type { RssSearcher } from "@src/module/implemention/rss.searcher";
import { SitemapXmlParser } from "@src/module/parser/sitemap-xml-parser";
import type { DownloadPostsExceptions } from "@src/module/use-case/download-posts/download-posts.exception";

type UseCaseResponse = EitherResult<
	void,
	DownloadPostsExceptions.ParseMarkdownFailedException | DownloadPostsExceptions.RssReadNotSupportedPlatformException
>;

export class DownloadPostsUseCase implements UseCase<[Metadata, Sitemap], UseCaseResponse> {
	constructor(
		private readonly fileUploader: FileUploader,
		private readonly rssSearcher: RssSearcher,
	) {}

	async execute(metadata: Metadata, sitemap: Sitemap): Promise<UseCaseResponse> {
		const publisher = metadata.publisher;

		const posts = await this.rssSearcher.searchUnuploadedPosts(publisher);
		if (posts.isEmpty) return EitherResult.complete();

		await this.fileUploader.uploadPosts(posts);
		publisher.lastPublishedId = BlogPublishedId.from(
			AutoIncrementManager.instance.getCurrentId(PostEntity.ENTITY_KEY).toNumber(),
		).getValue();
		for (const post of posts.getAll()) {
			sitemap.urlSet.putUrl(SitemapXmlParser.parsePostUrl(post));
		}

		return EitherResult.complete();
	}
}
