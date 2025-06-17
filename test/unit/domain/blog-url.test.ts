import { BlogUrl } from "@src/module/domain/blog-url";

describe("BlogUrl", () => {
	it("should create a valid blog URL", () => {
		const result = BlogUrl.from("https://example.com");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("https://example.com/");
	});

	it("should not create a blog URL with null or undefined value", () => {
		const nullResult = BlogUrl.from(null as unknown as string);
		expect(nullResult.isSucceed).toBe(false);
		expect(nullResult.getReason()).toBe("BlogUrl cannot be null or undefined");

		const undefinedResult = BlogUrl.from(undefined as unknown as string);
		expect(undefinedResult.isSucceed).toBe(false);
		expect(undefinedResult.getReason()).toBe("BlogUrl cannot be null or undefined");
	});

	it("should not create a blog URL with invalid URL format", () => {
		const result = BlogUrl.from("invalid-url");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("BlogUrl must be a valid URL");
	});

	it("should return the URL string when toString is called", () => {
		const result = BlogUrl.from("https://example.com");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("https://example.com/");
	});
});
