import { UniqueEntityId } from "@src/core/unique-identifier";

export namespace ArrayUtil {
	export function range(start: number, end: number): number[] {
		return Array.from({ length: end - start }, (_, index) => index + start);
	}

	export function rangeIds(start: UniqueEntityId, end: UniqueEntityId): UniqueEntityId[] {
		const startNum = start.toNumber();
		const endNum = end.toNumber();
		return Array.from({ length: endNum - startNum }, (_, index) => UniqueEntityId.create(startNum + index));
	}
}
