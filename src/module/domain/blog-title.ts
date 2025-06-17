import { NullGuard } from "@src/core/null-guard";
import { Result } from "@src/core/result";
import { ValueObject } from "@src/core/value-object";

interface BlogTitleProperties {
	value: string;
}

export class BlogTitle extends ValueObject<BlogTitleProperties> {
	static readonly MIN_LENGTH: number = 1;
	static readonly MAX_LENGTH: number = 100;
	static readonly INVALIDATE_LENGTH: string =
		`Invalid blog title length, blog title must be between ${BlogTitle.MIN_LENGTH} and ${BlogTitle.MAX_LENGTH} characters`;

	private constructor(value: string) {
		super({ value });
	}

	toString(): string {
		return this.props.value;
	}

	static create(value: string): Result<BlogTitle> {
		const nullGuard = NullGuard.againstNullOrUndefined({
			argument: value,
			argumentName: "blog title",
		});
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());
		if (value.length < BlogTitle.MIN_LENGTH || BlogTitle.MAX_LENGTH < value.length)
			return Result.fail(BlogTitle.INVALIDATE_LENGTH);
		return Result.success(new BlogTitle(value));
	}
}
