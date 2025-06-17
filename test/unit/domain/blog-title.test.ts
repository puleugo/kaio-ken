import { BlogTitle } from "@src/module/domain/blog-title";

describe("BlogTitle", () => {
	it("should create a valid blog title", () => {
		const result = BlogTitle.create("My Blog");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("My Blog");
	});

	it("should not create a blog title with null or undefined value", () => {
		const nullResult = BlogTitle.create(null as unknown as string);
		expect(nullResult.isSucceed).toBe(false);
		expect(nullResult.getReason()).toBe("blog title cannot be null or undefined");

		const undefinedResult = BlogTitle.create(undefined as unknown as string);
		expect(undefinedResult.isSucceed).toBe(false);
		expect(undefinedResult.getReason()).toBe("blog title cannot be null or undefined");
	});

	it("should not create a blog title with empty string", () => {
		const result = BlogTitle.create("");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Invalid blog title length, blog title must be between 1 and 100 characters");
	});

	it("should not create a blog title longer than 100 characters", () => {
		const longTitle = "a".repeat(101);
		const result = BlogTitle.create(longTitle);
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Invalid blog title length, blog title must be between 1 and 100 characters");
	});

	it("should create a blog title with exactly 100 characters", () => {
		const title = "a".repeat(100);
		const result = BlogTitle.create(title);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(title);
	});

	it("should create a blog title with exactly 1 character", () => {
		const result = BlogTitle.create("a");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("a");
	});
});
