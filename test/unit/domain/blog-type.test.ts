import { BlogType } from "@src/module/domain/blog-type";

describe("BlogType", () => {
	it("should have static values for PUBLISHER, SUBSCRIBER, and UNSUBSCRIBER", () => {
		expect(BlogType.PUBLISHER.toString()).toBe("PUBLISHER");
		expect(BlogType.SUBSCRIBER.toString()).toBe("SUBSCRIBER");
		expect(BlogType.UNSUBSCRIBER.toString()).toBe("UNSUBSCRIBER");
	});

	it("should return all values in values()", () => {
		const values = BlogType.values().map((v) => v.toString());
		expect(values).toEqual(["PUBLISHER", "SUBSCRIBER", "UNSUBSCRIBER"]);
	});

	it("should validate valid blog types", () => {
		expect(BlogType.create("PUBLISHER").isSucceed).toBe(true);
		expect(BlogType.create("SUBSCRIBER").isSucceed).toBe(true);
		expect(BlogType.create("UNSUBSCRIBER").isSucceed).toBe(true);
	});

	it("should not validate invalid blog types", () => {
		expect(BlogType.create("INVALID").isSucceed).toBeFalsy();
		expect(BlogType.create("").isSucceed).toBeFalsy();
		expect(BlogType.create("publisher").isSucceed).toBeFalsy();
	});

	it("should return Success for valid types in validate()", () => {
		const result = BlogType.create("PUBLISHER");
		expect(result.isSucceed).toBeTruthy();
		expect(result.getValue().toString()).toBe("PUBLISHER");
	});

	it("should return Failure for invalid types in validate()", () => {
		const result = BlogType.create("INVALID");
		expect(result.isSucceed).toBeFalsy();
		expect(result.getReason()).toMatch(/Invalid blog type/);
	});

	it("should return the correct type via getter", () => {
		const publisher = BlogType.PUBLISHER;
		expect(publisher.toString()).toBe("PUBLISHER");
	});
});
