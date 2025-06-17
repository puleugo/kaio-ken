import { Result } from "@src/core/result";
import { ValueObject } from "@src/core/value-object";

interface BlogTypeProperties {
	value: string;
}

export class BlogType extends ValueObject<BlogTypeProperties> {
	static readonly PUBLISHER = new BlogType("PUBLISHER");
	static readonly SUBSCRIBER = new BlogType("SUBSCRIBER");
	static readonly UNSUBSCRIBER = new BlogType("UNSUBSCRIBER");

	private static readonly INVALIDATE_BLOG_TYPE: string =
		`Invalid blog type, blog type must be one of ${BlogType.PUBLISHER}, ${BlogType.SUBSCRIBER}, ${BlogType.UNSUBSCRIBER}`;

	private constructor(value: string) {
		super({ value });
	}

	static values(): Array<BlogType> {
		return [BlogType.PUBLISHER, BlogType.SUBSCRIBER, BlogType.UNSUBSCRIBER];
	}

	toString(): string {
		return this.props.value;
	}

	private static isValid(value: string): boolean {
		return BlogType.values().some((type) => type.props.value.toUpperCase() === value);
	}

	static create(value: string): Result<BlogType> {
		if (!BlogType.isValid(value)) return Result.fail(BlogType.INVALIDATE_BLOG_TYPE);
		return Result.success(new BlogType(value));
	}
}
