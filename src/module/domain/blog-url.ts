import { NullGuard } from "@src/core/null-guard";
import { Result } from "@src/core/result";
import { ValueObject } from "@src/core/value-object";

interface postUrlProperties {
	value: URL;
}

export class BlogUrl extends ValueObject<postUrlProperties> {
	private static readonly NOT_NULL = "BlogUrl cannot be null or undefined";
	private static readonly INVALID_URL = "BlogUrl must be a valid URL";

	private constructor(value: postUrlProperties) {
		super(value);
	}

	toUrl(): URL {
		return this.props.value;
	}

	toString(): string {
		return this.props.value.toString();
	}

	static from(value: string): Result<BlogUrl> {
		const nullGuard = NullGuard.againstNullOrUndefined({
			argument: value,
			argumentName: "blogUrl",
		});
		if (nullGuard.isFailed) return Result.fail(BlogUrl.NOT_NULL);
		if (!URL.canParse(value)) return Result.fail(BlogUrl.INVALID_URL);
		const url = new URL(value);

		return Result.success(new BlogUrl({ value: url }));
	}
}
