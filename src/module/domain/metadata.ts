import { NullGuard } from "@src/core/null-guard";
import { Result } from "@src/core/result";
import { ValueObject } from "@src/core/value-object";
import YAML from "yaml";
import { BlogType } from "./blog-type";
import type { BlogEntity } from "./blog.entity";
import type { Blogs } from "./blogs";

interface MetadataProperties {
	publisher: BlogEntity;
	blogs: Blogs;
}

interface Publisher {
	title: string;
	url: string;
	rssUrl: string;
	language: string;
	platform: string;
	id?: number;
	publishedId?: number;
}

interface Subscriber {
	title: string;
	url: string;
	language: string;
	platform: string;
	publishedId?: number;
	id?: number;
	subscribe?: boolean;
}

export interface MetadataJson {
	publisher: Publisher;
	blogs: Array<Subscriber>;
}

export class Metadata extends ValueObject<MetadataProperties> {
	static readonly PATH = "metadata.yaml";

	get publisher(): BlogEntity {
		return this.props.publisher;
	}

	get subscriberBlogs(): Blogs {
		return this.props.blogs;
	}

	set subscriberBlogs(blogs: Blogs) {
		this.props.blogs = blogs;
	}

	get lastBlogId(): number {
		const allBlogs = this.props.blogs.getAll();
		return Math.max(...allBlogs.map((blog) => blog.id.toNumber()), this.props.publisher.id.toNumber());
	}

	private constructor(props: MetadataProperties) {
		super(props);
	}

	toString(): string {
		const publisher = this.props.publisher;
		const other = this.props.blogs;

		return YAML.stringify({
			publisher: {
				id: publisher.id.toNumber(),
				title: publisher.title.toString(),
				url: publisher.url.toString(),
				rssUrl: publisher.rssUrl?.toString() ?? "",
				language: publisher.language.toString(),
				platform: publisher.platform.toString(),
				publishedId: publisher.lastPublishedId.toNumber(),
			},
			blogs: other.getAll().map((blog) => ({
				id: blog.id.toNumber(),
				title: blog.title.toString(),
				url: blog.url.toString(),
				rssUrl: publisher.rssUrl?.toString(),
				language: blog.language.toString(),
				platform: blog.platform.toString(),
				publishedId: blog.lastPublishedId.toNumber(),
				subscribe: blog.type.equals(BlogType.SUBSCRIBER),
			})),
		});
	}

	static from(props: MetadataProperties): Result<Metadata> {
		const nullResult = NullGuard.againstNullOrUndefinedBulk([
			{ argument: props.publisher, argumentName: "publisher" },
			{ argument: props.blogs, argumentName: "blogs" },
		]);

		if (nullResult.isFailed) return Result.fail(nullResult.getReason());

		return Result.success(new Metadata(props));
	}

	static createEmpty(): MetadataJson {
		return {
			publisher: {
				id: 1,
				title: "<INPUT PUBLISHING BLOG TITLE>",
				url: "<INPUT PUBLISHING BLOG URL>",
				rssUrl: "<INPUT BLOG RSS URL>",
				language: "<INPUT PUBLISHING BLOG LANGUAGE(hreflang e.g. ko-KR, en)>",
				platform: "<INPUT PUBLISHING BLOG PLATFORM>",
			},
			blogs: [
				{
					id: 2,
					title: "<INPUT SUBSCRIBING BLOG TITLE>",
					url: "<INPUT SUBSCRIBING BLOG URL>",
					language: "<INPUT TRANSLATING LANGUAGE(hreflang e.g. ko-KR, en)>",
					platform: "<INPUT SUBSCRIBING BLOG PLATFORM>",
				},
				{
					id: 3,
					title: "<EXAMPLE OF UN-SUBSCRIBING BLOG>",
					url: "<BLOG URL>",
					language: "ja",
					platform: "qiita",
					subscribe: false,
				},
			],
		};
	}

	updateSubscribersPublishedId() {
		const publisher = this.publisher.lastPublishedId;
		this.props.blogs.updatePublishedId(publisher);
	}
}
