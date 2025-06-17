import { randomUUID } from "node:crypto";
import { AutoIncrementManager } from "./auto-increment-manager";
import { Identifier } from "./identifier";

type UUIDProperties = { strategy: "uuid"; props: { version: "1" | "4" } };
type AutoIncrementProperties = {
	strategy: "auto-increment";
	props: { key: string };
};
export type AutoGenerateStrategy = UUIDProperties | AutoIncrementProperties;

type IdValue = string | number;

export class UniqueEntityId extends Identifier<IdValue> {
	private static strategies: {
		[K in AutoGenerateStrategy["strategy"]]: (
			props: Extract<AutoGenerateStrategy, { strategy: K }>["props"],
		) => string | number;
	} = {
		uuid: () => randomUUID(),
		"auto-increment": (props) => AutoIncrementManager.instance.getNextId(props.key),
	};

	private constructor(props?: AutoGenerateStrategy, value?: IdValue) {
		if (value !== undefined) {
			super(value);
			return;
		}
		if (props !== undefined) {
			const strategy = UniqueEntityId.strategies[props.strategy] as (props: unknown) => IdValue;
			const generated = strategy(props.props);
			super(generated);
			return;
		}
		throw new Error("Either a value or properties for auto-generation must be provided.");
	}

	static generate(strategy: AutoGenerateStrategy): UniqueEntityId {
		return new UniqueEntityId(strategy);
	}

	static create(value: IdValue): UniqueEntityId {
		return new UniqueEntityId(undefined, value);
	}

	beforeOrEquals(targetNum: number) {
		const thisNum = this.toNumber();
		return thisNum <= targetNum;
	}
}
