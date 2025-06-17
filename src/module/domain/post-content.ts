import { Result } from "../../core/result";
import { ValueObject } from "../../core/value-object";
import { StringUtil } from "../../shared/util/string.util";

interface PostContentProperties {
	value: string;
}

export class PostContent extends ValueObject<PostContentProperties> {
	private static readonly MIN_LENGTH = 1;
	private static readonly MAX_LENGTH = 65_535;

	toString(): string {
		return this.props.value;
	}

	static from(value: string): Result<PostContent> {
		if (PostContent.MIN_LENGTH > value.length || value.length > PostContent.MAX_LENGTH)
			return Result.fail(
				`Post content must be between ${PostContent.MIN_LENGTH} and ${StringUtil.parseNumberWithCommas(PostContent.MAX_LENGTH)} characters long`,
			);

		return Result.success(new PostContent({ value }));
	}
}
