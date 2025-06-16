import { Result } from "@src/core/result";
import type { UseCaseException } from "@src/core/use-case.exception";

export namespace PublishPostsExceptions {
	export class PublishNotSupportedPlatformException extends Result<UseCaseException> {
		constructor(platform: string) {
			super(false, `The platform ${platform} is not supported for publishing posts`);
		}
	}
}
