import { Result } from "./result";

export interface GuardProperty {
	argument: unknown;
	argumentName: string;
}

type GuardArgumentCollection = Array<GuardProperty>;

export namespace NullGuard {
	export function isNonNullable<T>(value: T | undefined | null): value is NonNullable<T> {
		return value !== null && value !== undefined;
	}

	export function againstNullOrUndefined(prop: GuardProperty): Result<null> {
		const { argument, argumentName } = prop;
		if (argument === null || argument === undefined) {
			return Result.fail(`${argumentName} cannot be null or undefined`);
		}
		return Result.complete();
	}

	export function againstNullOrUndefinedBulk(args: GuardArgumentCollection): Result<null> {
		for (const arg of args) {
			const result = NullGuard.againstNullOrUndefined(arg);
			if (result.isFailed) return result;
		}

		return Result.complete();
	}

	export function getOrThrow<T>(value: T, argumentName: string): NonNullable<T> {
		const exist = NullGuard.isNonNullable(value);
		if (!exist) throw new Error(`${argumentName} cannot be null or undefined`);

		return value;
	}
}
