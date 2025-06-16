import type { Result } from "./result";
import type { UseCaseException } from "./use-case.exception";

export class EitherResult<SUCCESS, FAILURE> {
	readonly isSucceed: boolean;
	readonly isFailed: boolean;
	private readonly success: SUCCESS | null;
	private readonly failure: FAILURE | null;

	private constructor(isSucceed: boolean, success?: SUCCESS, failure?: FAILURE) {
		this.isSucceed = isSucceed;
		this.isFailed = !isSucceed;
		this.success = success || null;
		this.failure = failure || null;
	}

	getValue(): SUCCESS {
		if (!this.isSucceed || this.success === null) throw new Error("Can't get the value of an error result.");

		return this.success;
	}

	getFailure(): FAILURE {
		if (this.isSucceed || this.failure === null) throw new Error("Can't get the reasons of a success result.");

		return this.failure;
	}

	static complete(): EitherResult<void, never> {
		return new EitherResult<void, never>(true);
	}

	static success<S>(value: S): EitherResult<S, never> {
		return new EitherResult<S, never>(true, value);
	}

	static fail<F extends Result<UseCaseException>>(value: F): EitherResult<never, F> {
		return new EitherResult<never, F>(false, undefined, value);
	}
}
