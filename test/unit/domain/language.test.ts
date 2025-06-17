import { Language } from "@src/module/domain/language";

describe("Language", () => {
	it("should create a valid language", () => {
		const result = Language.from("en");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("en");
	});

	it("should not create a language with invalid code", () => {
		const result = Language.from("invalid-code");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Not valid href code");
	});

	it("should handle common language codes", () => {
		const commonCodes = ["en", "ja", "ko-KR", "zh-CN", "es"];
		for (const code of commonCodes) {
			const result = Language.from(code);
			expect(result.isSucceed).toBe(true);
			expect(result.getValue().toString()).toBe(code);
		}
	});

	it("should handle regional language codes", () => {
		const regionalCodes = ["en-US", "en-GB", "zh-TW", "pt-BR"];
		for (const code of regionalCodes) {
			const result = Language.from(code);
			expect(result.isSucceed).toBe(true);
			expect(result.getValue().toString()).toBe(code);
		}
	});

	it("should handle special language codes", () => {
		const specialCodes = ["zh-Hans", "zh-Hant", "nb-NO", "nn-NO"];
		for (const code of specialCodes) {
			const result = Language.from(code);
			expect(result.isSucceed).toBe(true);
			expect(result.getValue().toString()).toBe(code);
		}
	});

	it("should be case sensitive", () => {
		const result = Language.from("EN");
		expect(result.isSucceed).toBe(false);
		expect(result.getReason()).toBe("Not valid href code");
	});

	it("should handle all predefined language values", () => {
		const predefinedLanguages = Object.keys(Language.values);
		for (const lang of predefinedLanguages) {
			const result = Language.from(Language.values[lang].toString());
			expect(result.isSucceed).toBe(true);
		}
	});
});
