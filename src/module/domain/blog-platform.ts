import { Result } from "@src/core/result";
import { ValueObject } from "@src/core/value-object";

const blogPlatformMap = {
	tistory: "TISTORY",
	velog: "VELOG",
	qiita: "QIITA",
	medium: "MEDIUM",
	wordpress: "WORDPRESS",
};
Object.freeze(blogPlatformMap);

type BlogPlatformMap = typeof blogPlatformMap;
type BlogPlatformMapKey = keyof BlogPlatformMap;
type BlogPlatformSlug = keyof BlogPlatformMap;

interface BlogPlatformProperties {
	value: BlogPlatformMapKey;
}

export class BlogPlatform extends ValueObject<BlogPlatformProperties> {
	static readonly values = Object.entries(blogPlatformMap).reduce(
		(acc, [code]) => {
			acc[code] = new BlogPlatform({ value: code.toUpperCase() as BlogPlatformMapKey });
			return acc;
		},
		{} as Record<BlogPlatformSlug, BlogPlatform>,
	);

	toString(): string {
		return this.props.value;
	}

	protected constructor(props: BlogPlatformProperties) {
		super(props);
	}

	static from(platform: string): Result<BlogPlatform> {
		if (Object.values(blogPlatformMap).some((value) => value.toUpperCase() === platform.toUpperCase()))
			return Result.success(new BlogPlatform({ value: platform.toUpperCase() as BlogPlatformMapKey }));

		return Result.fail(`Platform not registered: ${platform}`);
	}
}
