import { PostUrl } from "@src/module/domain/post-url";

describe("PostUrl", () => {
	it("should create a valid post URL", () => {
		const result = PostUrl.from("https://example.com/post/123");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("https://example.com/post/123");
	});

	it("should not create a post URL with null or undefined value", () => {
		const nullResult = PostUrl.from(null as unknown as string);
		expect(nullResult.isSucceed).toBe(false);
		expect(nullResult.getReason()).toBe("PostUrl cannot be null or undefined");

		const undefinedResult = PostUrl.from(undefined as unknown as string);
		expect(undefinedResult.isSucceed).toBe(false);
		expect(undefinedResult.getReason()).toBe("PostUrl cannot be null or undefined");
	});

	it("should not create a post URL with invalid URL format", () => {
		const result = PostUrl.from("invalid-url");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("PostUrl must be a valid URL");
	});

	it("should return the URL string when toString is called", () => {
		const result = PostUrl.from("https://example.com/post/123");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("https://example.com/post/123");
	});
});
