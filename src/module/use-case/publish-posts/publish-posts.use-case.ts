import { EitherResult } from "@src/core/either-result";
import type { Result } from "@src/core/result";
import type { UseCase } from "@src/core/use-case";
import type { UseCaseException } from "@src/core/use-case.exception";
import type { BlogEntity } from "@src/module/domain/blog.entity";
import { Blogs } from "@src/module/domain/blogs";
import type { Metadata } from "@src/module/domain/metadata";
import type { Sitemap } from "@src/module/domain/sitemap";
import type { Translations } from "@src/module/domain/translations";
import type { FileReader } from "@src/module/implemention/file.reader";
import type { TranslationUploader } from "@src/module/implemention/translation-uploader";
import { SitemapXmlParser } from "@src/module/parser/sitemap-xml-parser";
import type { PublishPostsExceptions } from "@src/module/use-case/publish-posts/publish-posts.exception";

interface EffectDto {
	effected: number;
	exceptions: Array<PublishPostsExceptions.PublishNotSupportedPlatformException>;
}

type UseCaseResponse = EitherResult<EffectDto, PublishPostsExceptions.PublishNotSupportedPlatformException>;

export class PublishPostsUseCase implements UseCase<[Metadata, Sitemap], UseCaseResponse> {
	constructor(
		private readonly fileReader: FileReader,
		private readonly translationUploader: TranslationUploader,
	) {}

	async execute(metadata: Metadata, sitemap: Sitemap): Promise<UseCaseResponse> {
		const subscribers = metadata.subscriberBlogs.getAll();
		const promises = subscribers.map((subscriber) => this.handleSubscriber(subscriber, sitemap));
		const results = await Promise.allSettled(promises);

		const successfulSubscribers: Array<BlogEntity> = [];
		const exceptions: Array<Result<UseCaseException>> = [];

		for (const result of results) {
			if (result.status === "rejected") {
				exceptions.push(result.reason);
				continue;
			}
			successfulSubscribers.push(result.value);
		}

		metadata.subscriberBlogs = Blogs.of(successfulSubscribers).getValue();

		return EitherResult.success({
			effected: successfulSubscribers.length,
			exceptions,
		});
	}

	private async handleSubscriber(subscriber: BlogEntity, sitemap: Sitemap): Promise<BlogEntity> {
		if (subscriber.isUnSubscriber()) {
			return subscriber;
		}

		const uploadablePosts = await this.getUploadablePosts(subscriber);
		if (uploadablePosts.isEmpty) {
			return subscriber;
		}

		await this.translationUploader.uploadMany(subscriber, uploadablePosts);

		const posts = await this.fileReader.getPostsByTranslations(uploadablePosts.getAll());
		const tags = SitemapXmlParser.parsePostUrls(posts);
		sitemap.urlSet.putUrls(tags);

		subscriber.lastPublishedId = uploadablePosts.getLast().id;
		return subscriber;
	}

	private async getUploadablePosts(subscriber: BlogEntity): Promise<Translations> {
		const translations = await this.fileReader.readTranslations(subscriber.language);
		return translations.getNewerThan(subscriber.lastPublishedId);
	}
}
