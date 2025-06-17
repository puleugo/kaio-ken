import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import { ValueObject } from "../../core/value-object";

interface postUrlProperties {
	value: URL;
}

export class PostUrl extends ValueObject<postUrlProperties> {
	private static readonly NOT_NULL = "PostUrl cannot be null or undefined";
	private static readonly INVALID_URL = "PostUrl must be a valid URL";

	private constructor(value: postUrlProperties) {
		super(value);
	}

	toString(): string {
		return this.props.value.toString();
	}

	toUrl() {
		return this.props.value;
	}

	static from(value: string): Result<PostUrl> {
		const nullGuard = NullGuard.againstNullOrUndefined({
			argument: value,
			argumentName: "postUrl",
		});
		if (nullGuard.isFailed) return Result.fail(PostUrl.NOT_NULL);
		if (!URL.canParse(value)) return Result.fail(PostUrl.INVALID_URL);

		return Result.success(new PostUrl({ value: new URL(value) }));
	}
}
