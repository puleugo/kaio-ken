import { Result } from "../../core/result";
import type { UniqueEntityId } from "../../core/unique-identifier";
import { ValueObject } from "../../core/value-object";
import type { Language } from "./language";
import type { PostContent } from "./post-content";
import type { PostTitle } from "./post-title";
import { PostUploadedDate } from "./post-uploaded-date";
import type { PostUrl } from "./post-url";

interface TranslationProperties {
	postId: UniqueEntityId;
	title: PostTitle;
	language: Language;
	content: PostContent;
	uploadedAt: PostUploadedDate | null;
	url: PostUrl | null;
}

export class Translation extends ValueObject<TranslationProperties> {
	get id(): UniqueEntityId {
		return this.props.postId;
	}

	get language(): Language {
		return this.props.language;
	}

	get title(): PostTitle {
		return this.props.title;
	}

	get url(): PostUrl | null {
		return this.props.url;
	}

	get uploadedAt(): PostUploadedDate | null {
		return this.props.uploadedAt;
	}

	get content(): PostContent {
		return this.props.content;
	}

	putUploadData(url: PostUrl, uploadedAt = PostUploadedDate.now()): void {
		this.props.url = url;
		this.props.uploadedAt = uploadedAt;
	}

	static create(props: TranslationProperties): Result<Translation> {
		return Result.success(new Translation(props));
	}
}
