import { Result } from "@src/core/result";
import type { UseCaseException } from "@src/core/use-case.exception";

export namespace DownloadPostsExceptions {
	export class ParseMarkdownFailedException extends Result<UseCaseException> {
		constructor(reason: string) {
			super(false, reason);
		}
	}

	export class RssReadNotSupportedPlatformException extends Result<UseCaseException> {
		constructor(platform: string) {
			super(false, `The platform ${platform} is not supported`);
		}
	}
}
