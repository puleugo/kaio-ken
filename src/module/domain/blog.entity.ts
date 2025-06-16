import { Entity } from "@src/core/entity";
import { NullGuard } from "@src/core/null-guard";
import { Result } from "@src/core/result";
import type { UniqueEntityId } from "@src/core/unique-identifier";
import type { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogPublishedId } from "@src/module/domain/blog-published-id";
import type { BlogTitle } from "@src/module/domain/blog-title";
import { BlogType } from "@src/module/domain/blog-type";
import type { BlogUrl } from "@src/module/domain/blog-url";
import type { Language } from "@src/module/domain/language";

export interface SubscriberBlogProperties {
	title: BlogTitle;
	language: Language;
	platform: BlogPlatform;
	type: BlogType;
	lastPublishedId: BlogPublishedId;
	url: BlogUrl;
	rssUrl?: BlogUrl;
}

export interface PublisherBlogProperties extends SubscriberBlogProperties {
	rssUrl: BlogUrl;
}

type BlogProperties = SubscriberBlogProperties | PublisherBlogProperties;

type BlogEntityPropsWithDefault = Omit<BlogProperties, "lastPublishedId"> & {
	rssUrl?: BlogUrl;
	lastPublishedId?: BlogPublishedId;
};

export class BlogEntity extends Entity<BlogProperties> {
	static ENTITY_KEY = "BlogEntity";

	get id(): UniqueEntityId {
		return this._id;
	}

	get url(): BlogUrl {
		return this.props.url;
	}

	get lastPublishedId(): BlogPublishedId {
		return this.props.lastPublishedId;
	}

	set lastPublishedId(id: BlogPublishedId) {
		this.props.lastPublishedId = id;
	}

	get type(): BlogType {
		return this.props.type;
	}

	get rssUrl(): BlogUrl | undefined {
		return this.props.rssUrl;
	}

	isPublisher(): this is BlogEntity & { rssUrl: NonNullable<BlogEntity["rssUrl"]> } {
		return this.props.type.equals(BlogType.PUBLISHER) && NullGuard.isNonNullable(this.props.rssUrl);
	}

	isUnSubscriber(): boolean {
		return this.props.type.equals(BlogType.PUBLISHER);
	}

	get title(): BlogTitle {
		return this.props.title;
	}

	get platform(): BlogPlatform {
		return this.props.platform;
	}

	get language(): Language {
		return this.props.language;
	}

	private constructor(props: BlogProperties, id?: UniqueEntityId) {
		super(props, { strategy: "auto-increment", props: { key: BlogEntity.ENTITY_KEY } }, id);
	}

	static create(props: BlogEntityPropsWithDefault, id?: UniqueEntityId): Result<BlogEntity> {
		const nullGuard = NullGuard.againstNullOrUndefinedBulk([
			{ argument: props.title, argumentName: "title" },
			{ argument: props.url, argumentName: "url" },
			{ argument: props.platform, argumentName: "platform" },
			{ argument: props.language, argumentName: "language" },
			{ argument: props.type, argumentName: "type" },
		]);
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());

		const isPublisher = props.type.equals(BlogType.PUBLISHER);
		const isValidPublisher = isPublisher && !NullGuard.isNonNullable(props.rssUrl);
		if (isValidPublisher) {
			return Result.fail("Publisher blog must contains a rssUrl");
		}

		const baseProps = {
			...props,
			lastPublishedId: props.lastPublishedId ?? BlogPublishedId.from(0).getValue(),
		};

		const blogProps: BlogProperties =
			isPublisher && NullGuard.isNonNullable(props.rssUrl)
				? ({ ...baseProps, rssUrl: props.rssUrl } satisfies PublisherBlogProperties)
				: (baseProps satisfies SubscriberBlogProperties);

		return Result.success(new BlogEntity(blogProps, id));
	}
}
