import { Result } from "@src/core/result";

interface idProperties {
	value: number;
}

export class BlogPublishedId {
	private static readonly NOT_NULL = "BlogPublishedId cannot be null or undefined";
	private static readonly INVALID_ID = "BlogPublishedId must be a positive integer";

	private constructor(private readonly props: idProperties) {}

	toNumber(): number {
		return this.props.value;
	}

	static from(value: number): Result<BlogPublishedId> {
		if (value === null || value === undefined) return Result.fail(BlogPublishedId.NOT_NULL);
		if (!Number.isInteger(value) || value < 0) return Result.fail(BlogPublishedId.INVALID_ID);
		return Result.success(new BlogPublishedId({ value }));
	}
}
