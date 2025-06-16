import { AutoIncrementManager } from "../../../src/core/auto-increment-manager";
import { UniqueEntityId } from "../../../src/core/unique-identifier";

describe("UniqueEntityId", () => {
	describe("UUID generation", () => {
		it("should generate UUID v4", () => {
			const id = UniqueEntityId.generate({ strategy: "uuid", props: { version: "4" } });
			expect(id.toString()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		});
	});

	describe("Auto-increment generation", () => {
		it("should generate auto-increment id", () => {
			AutoIncrementManager.instance.register("test", 0);
			const id = UniqueEntityId.generate({ strategy: "auto-increment", props: { key: "test" } });
			expect(typeof id.toString()).toBe("string");
		});
	});

	describe("Manual creation", () => {
		it("should create with string value", () => {
			const id = UniqueEntityId.create("test-id");
			expect(id.toString()).toBe("test-id");
		});

		it("should create with number value", () => {
			const id = UniqueEntityId.create(123);
			expect(id.toString()).toBe("123");
		});
	});

	describe("Error cases", () => {
		it("should throw error when no value or strategy provided", () => {
			//@ts-expect-error
			expect(() => new UniqueEntityId()).toThrow("Either a value or properties for auto-generation must be provided.");
		});
	});
});
