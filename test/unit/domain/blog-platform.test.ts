import { BlogPlatform } from "@src/module/domain/blog-platform";

describe("BlogPlatform", () => {
	it("should create a valid blog platform", () => {
		const result = BlogPlatform.from("tistory");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("tistory");
	});

	it("should not create a blog platform with invalid value", () => {
		const result = BlogPlatform.from("invalid-platform");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Platform not registered");
	});

	it("should handle all registered platforms", () => {
		const platforms = ["tistory", "velog", "qiita", "medium", "wordpress"];
		for (const platform of platforms) {
			const result = BlogPlatform.from(platform);
			expect(result.isSucceed).toBe(true);
			expect(result.getValue().toString()).toBe(platform);
		}
	});

	it("should be case sensitive", () => {
		const result = BlogPlatform.from("Tistory");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Platform not registered");
	});
});
