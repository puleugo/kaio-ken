export class Result<V> {
	readonly isSucceed: boolean;
	private readonly value: V | null;
	private readonly reason: string;

	get isFailed(): boolean {
		return !this.isSucceed;
	}

	protected constructor(isSucceed: boolean, reasons: string, value?: V) {
		if (isSucceed && value === undefined) throw new Error("Succeed Result value must be required.");
		this.isSucceed = isSucceed;
		this.reason = reasons;
		this.value = value || null;
	}

	getValue(): V {
		if (!this.isSucceed || this.value === null)
			throw new Error(this.reason || "Can't get the value of an error result.");

		return this.value;
	}

	getReason(): string {
		if (this.isSucceed) throw new Error("Can't get the reason of a success result.");

		return this.reason;
	}

	static complete(): Result<null> {
		return new Result<null>(true, "complete", null);
	}

	static success<U>(value: U): Result<U> {
		return new Result<U>(true, "success", value);
	}

	static fail<U>(reasons: string): Result<U> {
		return new Result<U>(false, reasons);
	}

	static containsFailure<T>(result: Array<Result<T>>): boolean {
		return result.some((result) => !result.isSucceed);
	}

	static getFirstFailure<U>(results: Array<Result<U>>): Result<U> | null {
		for (const result of results) {
			if (!result.isSucceed) return result;
		}
		return null;
	}
}
