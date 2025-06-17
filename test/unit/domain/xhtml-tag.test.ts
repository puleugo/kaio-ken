import { Language } from "@src/module/domain/language";
import { XhtmlTag } from "@src/module/domain/xhtml-tag";

describe("XhtmlTag", () => {
	it("should create an xhtml:link tag with correct attributes", () => {
		const location = new URL("https://example.com/post");
		const language = Language.from("en").getValue();
		const href = new URL("https://example.com/post/en");

		const result = XhtmlTag.create({ location, language, href });
		expect(result.isSucceed).toBe(true);

		const xhtmlTag = result.getValue();
		expect(xhtmlTag.location.toString()).toBe("https://example.com/post");
		expect(xhtmlTag.toString()).toContain('rel="alternate"');
		expect(xhtmlTag.toString()).toContain('hreflang="en"');
		expect(xhtmlTag.toString()).toContain('href="https://example.com/post/en"');
	});

	it("should handle different language codes", () => {
		const location = new URL("https://example.com/post");
		const language = Language.from("ja").getValue();
		const href = new URL("https://example.com/post/japanese");

		const result = XhtmlTag.create({ location, language, href });
		expect(result.isSucceed).toBe(true);
		const xhtmlTag = result.getValue();

		expect(xhtmlTag.toString()).toContain("ja");
	});

	it("should handle different URLs", () => {
		const location = new URL("https://example.com/post/123");
		const language = Language.from("ko-KR").getValue();
		const href = new URL("https://example.com/post/123/ko");

		const result = XhtmlTag.create({ location, language, href });
		expect(result.isSucceed).toBe(true);
		const xhtmlTag = result.getValue();

		expect(xhtmlTag.toString()).toContain("https://example.com/post/123/ko");
		expect(xhtmlTag.toString()).toContain('hreflang="ko-KR"');
	});

	it("should maintain XML structure", () => {
		const location = new URL("https://example.com/post");
		const language = Language.from("en").getValue();
		const href = new URL("https://example.com/post/en");

		const result = XhtmlTag.create({ location, language, href });
		const xhtmlTag = result.getValue();

		expect(xhtmlTag.toString()).toMatch(
			/^<xhtml:link\s+rel="alternate"\s+hreflang="en"\s+href="https:\/\/example.com\/post\/en"\s\/>$/i,
		);
	});
});
