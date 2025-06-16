import { PostTitle } from "@src/module/domain/post-title";

describe("PostTitle", () => {
	it("should create a valid post title", () => {
		const result = PostTitle.from("Valid Post Title");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("Valid Post Title");
	});

	it("should not create a post title with null or undefined value", () => {
		const nullResult = PostTitle.from(null as unknown as string);
		expect(nullResult.isSucceed).toBe(false);
		expect(nullResult.getReason()).toBe("PostTitle cannot be null or undefined");

		const undefinedResult = PostTitle.from(undefined as unknown as string);
		expect(undefinedResult.isSucceed).toBe(false);
		expect(undefinedResult.getReason()).toBe("PostTitle cannot be null or undefined");
	});

	it("should not create a post title with empty string", () => {
		const result = PostTitle.from("");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("PostTitle must be between 1 and 100 characters");
	});

	it("should not create a post title longer than 100 characters", () => {
		const longTitle = "a".repeat(101);
		const result = PostTitle.from(longTitle);
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("PostTitle must be between 1 and 100 characters");
	});

	it("should create a post title with exactly 100 characters", () => {
		const title = "a".repeat(100);
		const result = PostTitle.from(title);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(title);
	});

	it("should create a post title with exactly 1 character", () => {
		const result = PostTitle.from("a");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("a");
	});

	it("should remove whitespace in the title", () => {
		const title = "  Title with spaces  ";
		const result = PostTitle.from(title);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("Title with spaces");
	});
});
