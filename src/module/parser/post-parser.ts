import path from "node:path";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { PostUrl } from "@src/module/domain/post-url";
import { PostEntity } from "@src/module/domain/post.entity";
import { Translation } from "@src/module/domain/translation";

export interface PostParserProps {
	title: string;
	uploadedAt: Date;
	url: string;
	language: string;
	content: string;
}

export type TranslationParserProps = Pick<PostParserProps, "title" | "language" | "content"> & {
	uploadedAt: Date | null;
	url: string | null;
};

export namespace PostParser {
	export function parse(props: PostParserProps, id?: number): PostEntity {
		const titleOrError = PostTitle.from(props.title);
		if (titleOrError.isFailed) throw new Error(titleOrError.getReason());

		const uploadedAtOrError = PostUploadedDate.from(props.uploadedAt);
		if (uploadedAtOrError.isFailed) throw new Error(uploadedAtOrError.getReason());

		const urlOrError = PostUrl.from(props.url);
		if (urlOrError.isFailed) throw new Error(urlOrError.getReason());

		const languageOrError = Language.from(props.language);
		if (languageOrError.isFailed) throw new Error(languageOrError.getReason());

		const contentOrError = PostContent.from(props.content);
		if (contentOrError.isFailed) throw new Error(contentOrError.getReason());

		const postOrError = PostEntity.create(
			{
				title: titleOrError.getValue(),
				uploadedAt: uploadedAtOrError.getValue(),
				url: urlOrError.getValue(),
				language: languageOrError.getValue(),
				content: contentOrError.getValue(),
			},
			id ? UniqueEntityId.create(id) : undefined,
		);
		if (postOrError.isFailed) throw new Error(postOrError.getReason());
		return postOrError.getValue();
	}

	export function parseToTranslation(props: TranslationParserProps, id: UniqueEntityId): Translation {
		const titleOrError = PostTitle.from(props.title);
		if (titleOrError.isFailed) throw new Error(titleOrError.getReason());

		const languageOrError = Language.from(props.language);
		if (languageOrError.isFailed) throw new Error(languageOrError.getReason());

		const contentOrError = PostContent.from(props.content);
		if (contentOrError.isFailed) throw new Error(contentOrError.getReason());

		const translation = Translation.create({
			postId: id,
			title: titleOrError.getValue(),
			url: props.url ? PostUrl.from(props.url).getValue() : null,
			uploadedAt: props.uploadedAt ? PostUploadedDate.from(props.uploadedAt).getValue() : null,
			language: languageOrError.getValue(),
			content: contentOrError.getValue(),
		});
		if (translation.isFailed) throw new Error(translation.getReason());

		return translation.getValue();
	}

	export function getPath(language: Language, id: UniqueEntityId): string {
		return path.join(PostEntity.BASE_PATH, language.toString(), `${id.toString()}.md`);
	}
}
