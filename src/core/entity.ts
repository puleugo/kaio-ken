import { type AutoGenerateStrategy, UniqueEntityId } from "./unique-identifier";

const isEntity = <T>(v: unknown): v is Entity<T> => {
	return v instanceof Entity;
};

export abstract class Entity<T> {
	protected readonly _id: UniqueEntityId;
	protected readonly props: T;

	protected constructor(
		props: T,
		idGenerationStrategy: AutoGenerateStrategy,
		id?: UniqueEntityId,
	) {
		this._id = id ? id : UniqueEntityId.generate(idGenerationStrategy);
		this.props = props;
	}

	public equals(object?: Entity<T>): boolean {
		if (object == null) return false;
		if (this === object) return true;
		if (!isEntity(object)) return false;

		return this._id.equals(object._id);
	}
}
