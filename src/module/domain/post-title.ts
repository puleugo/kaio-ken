import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import { ValueObject } from "../../core/value-object";

interface PostTitleProperties {
	value: string;
}

export class PostTitle extends ValueObject<PostTitleProperties> {
	private static NOT_NULL = "PostTitle cannot be null or undefined";
	private static INVALID_LENGTH = "PostTitle must be between 1 and 100 characters";

	private constructor(value: PostTitleProperties) {
		super(value);
	}

	toString(): string {
		return this.props.value;
	}

	static from(value: string): Result<PostTitle> {
		const nullGuard = NullGuard.againstNullOrUndefined({
			argument: value,
			argumentName: "postTitle",
		});
		if (nullGuard.isFailed) return Result.fail(PostTitle.NOT_NULL);
		const trimmedValue = value.trim();
		if (trimmedValue.length < 1 || 100 < trimmedValue.length) return Result.fail(PostTitle.INVALID_LENGTH);

		return Result.success(new PostTitle({ value: trimmedValue }));
	}
}
