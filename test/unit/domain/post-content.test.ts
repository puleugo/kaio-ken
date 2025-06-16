import { PostContent } from "@src/module/domain/post-content";

describe("PostContent", () => {
	it("should create a valid post content", () => {
		const content = "This is a valid post content.";
		const result = PostContent.from(content);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(content);
	});

	it("should not create a post content with empty string", () => {
		const result = PostContent.from("");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Post content must be between 1 and 65,535 characters long");
	});

	it("should not create a post content longer than 65,535 characters", () => {
		const longContent = "a".repeat(65_536);
		const result = PostContent.from(longContent);
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Post content must be between 1 and 65,535 characters long");
	});

	it("should create a post content with exactly 65,535 characters", () => {
		const content = "a".repeat(65_535);
		const result = PostContent.from(content);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(content);
	});

	it("should create a post content with exactly 1 character", () => {
		const result = PostContent.from("a");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("a");
	});

	it("should preserve whitespace in the content", () => {
		const content = "  Content with spaces  \n  and newlines  ";
		const result = PostContent.from(content);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(content);
	});

	it("should handle content with special characters", () => {
		const content = "Content with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?";
		const result = PostContent.from(content);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(content);
	});

	it("should handle content with emojis and unicode characters", () => {
		const content = "Content with emojis: 😊 🌟 and unicode: 你好世界";
		const result = PostContent.from(content);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe(content);
	});
});
