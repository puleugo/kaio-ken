import { Entity } from "../../core/entity";
import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import type { UniqueEntityId } from "../../core/unique-identifier";
import type { Language } from "./language";
import type { PostContent } from "./post-content";
import type { PostTitle } from "./post-title";
import type { PostUploadedDate } from "./post-uploaded-date";
import type { PostUrl } from "./post-url";
import { TranslationMap } from "./translation-map";

interface PostProperties {
	title: PostTitle;
	content: PostContent;
	uploadedAt: PostUploadedDate;
	url: PostUrl;
	language: Language;
	translations?: TranslationMap;
}

export class PostEntity extends Entity<Required<PostProperties>> {
	static readonly ENTITY_KEY = "PostEntity";
	static readonly BASE_PATH = "kaio-ken/posts";

	get id(): UniqueEntityId {
		return this._id;
	}

	get title(): PostTitle {
		return this.props.title;
	}

	get uploadedAt(): PostUploadedDate {
		return this.props.uploadedAt;
	}

	get translationMap(): TranslationMap {
		return this.props.translations;
	}

	get url(): PostUrl {
		return this.props.url;
	}

	get content(): PostContent {
		return this.props.content;
	}

	get language(): Language {
		return this.props.language;
	}

	private constructor(props: Required<PostProperties>, id?: UniqueEntityId) {
		super(props, { strategy: "auto-increment", props: { key: PostEntity.ENTITY_KEY } }, id);
	}

	static create(props: PostProperties, id?: UniqueEntityId): Result<PostEntity> {
		const nullGuard = NullGuard.againstNullOrUndefinedBulk([
			{ argument: props.title, argumentName: "title" },
			{ argument: props.content, argumentName: "content" },
			{ argument: props.uploadedAt, argumentName: "uploadedAt" },
			{ argument: props.url, argumentName: "url" },
			{ argument: props.language, argumentName: "language" },
		]);
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());

		const defaultPostProps: Required<PostProperties> = {
			...props,
			translations: props?.translations ?? new TranslationMap(),
		};

		return Result.success(new PostEntity(defaultPostProps, id));
	}
}
