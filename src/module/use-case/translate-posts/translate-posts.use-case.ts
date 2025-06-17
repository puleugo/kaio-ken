import { EitherResult } from "@src/core/either-result";
import type { UseCase } from "@src/core/use-case";
import type { Metadata } from "@src/module/domain/metadata";
import type { FileUploader } from "@src/module/implemention/file.uploader";
import type { Translator } from "@src/module/implemention/translator";
import type { TranslatePostsExceptions } from "@src/module/use-case/translate-posts/translate-failed.exception";

type UseCaseResponse = EitherResult<
	void,
	TranslatePostsExceptions.ParseMetadataFailedException | TranslatePostsExceptions.TranslateFailedException
>;

export class TranslatePostsUseCase implements UseCase<[Metadata], UseCaseResponse> {
	constructor(
		private readonly translator: Translator,
		private readonly fileUploader: FileUploader,
	) {}

	async execute(metadata: Metadata): Promise<UseCaseResponse> {
		const subscribers = metadata.subscriberBlogs.getSubscribers();

		const translations = await this.translator.translatePosts(
			subscribers.map((subscriber) => ({
				language: subscriber.language,
				lastPublishedId: subscriber.lastPublishedId,
			})),
		);
		await this.fileUploader.uploadTranslations(translations);
		metadata.updateSubscribersPublishedId();

		return EitherResult.complete();
	}
}
