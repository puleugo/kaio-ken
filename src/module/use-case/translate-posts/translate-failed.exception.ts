import { Result } from "@src/core/result";
import type { UseCaseException } from "@src/core/use-case.exception";
import { Metadata } from "@src/module/domain/metadata";

export namespace TranslatePostsExceptions {
	export class TranslateFailedException extends Result<UseCaseException> {
		constructor() {
			super(false, "The translate failed");
		}
	}

	export class ParseMetadataFailedException extends Result<UseCaseException> {
		constructor() {
			super(false, `Metadata is not valid. Please check ${Metadata.PATH} file`);
		}
	}
}
