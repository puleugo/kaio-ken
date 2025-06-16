import type { BlogEntity } from "@src/module/domain/blog.entity";
import type { Translations } from "@src/module/domain/translations";
import { BlogPlatformUploader } from "@src/module/implemention/blog-platform-uploader";
import type { TranslationUploader } from "@src/module/implemention/translation-uploader";
import { PublishPostsExceptions } from "@src/module/use-case/publish-posts/publish-posts.exception";

export class TranslationGithubUploader implements TranslationUploader {
	async uploadMany(subscriber: BlogEntity, translations: Translations): Promise<void> {
		const platform = subscriber.platform;
		const uploaderResult = BlogPlatformUploader.get(platform);

		if (uploaderResult.isFailed) {
			throw new PublishPostsExceptions.PublishNotSupportedPlatformException(platform.toString());
		}

		const uploader = uploaderResult.getValue();
		await uploader.uploadAll(translations);
	}
}
