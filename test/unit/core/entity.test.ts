import { Entity } from "../../../src/core/entity";
import { UniqueEntityId } from "../../../src/core/unique-identifier";

// Create a concrete implementation of Entity for testing
interface TestEntityProps {
	name: string;
}

class TestEntity extends Entity<TestEntityProps> {
	get id() {
		return this._id;
	}

	constructor(props: { name: string }, id?: UniqueEntityId) {
		super(props, { strategy: "uuid", props: { version: "4" } }, id);
	}
}

describe("Entity", () => {
	it("should create an domain with generated id", () => {
		const entity = new TestEntity({ name: "test" });
		expect(entity.id).toBeDefined();
	});

	it("should create an domain with provided id", () => {
		const id = UniqueEntityId.create("test-id");
		const entity = new TestEntity({ name: "test" }, id);
		expect(entity.id).toBe(id);
	});

	it("should return true when comparing same domain", () => {
		const entity = new TestEntity({ name: "test" });
		expect(entity.equals(entity)).toBe(true);
	});

	it("should return false when comparing with null", () => {
		const entity = new TestEntity({ name: "test" });
		//@ts-expect-error
		expect(entity.equals(null)).toBe(false);
	});

	it("should return false when comparing with non-domain", () => {
		const entity = new TestEntity({ name: "test" });
		expect(entity.equals({ name: "test" } as unknown as Entity<TestEntityProps>)).toBe(false);
	});

	it("should return true when comparing domain with same id", () => {
		const id = UniqueEntityId.create("test-id");
		const entity1 = new TestEntity({ name: "test1" }, id);
		const entity2 = new TestEntity({ name: "test2" }, id);
		expect(entity1.equals(entity2)).toBe(true);
	});
});
