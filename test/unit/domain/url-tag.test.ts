import { UrlTag } from "@src/module/domain/url-tag";

describe("UrlTag", () => {
	const validUrl = new URL("https://example.com");

	it("should create a valid url tag with only loc", () => {
		const result = UrlTag.create({ location: validUrl });
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().location).toBe(validUrl);
	});

	it("should create a valid url tag with all properties", () => {
		const lastModified = new Date("2024-03-20");
		const changeFrequency = "daily" as const;
		const priority = 0.8;

		const result = UrlTag.create({ location: validUrl, lastModified, changeFrequency, priority });
		expect(result.isSucceed).toBe(true);
		const urlTag = result.getValue();
		expect(urlTag.location).toBe(validUrl);
		expect(urlTag.toString()).toContain(`<loc>${validUrl.toString()}</loc>`);
		expect(urlTag.toString()).toContain(`<lastmod>${lastModified.toISOString()}</lastmod>`);
		expect(urlTag.toString()).toContain(`<changefreq>${changeFrequency}</changefreq>`);
	});

	it.each([1.5, -0.1])("should not create a url tag with invalid priority: %d", (priority) => {
		const result = UrlTag.create({ location: validUrl, priority });
		expect(result.isFailed).toBe(true);
		expect(result.getReason()).toBe("The priority must be between 0 and 1");
	});

	it.each(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"])(
		"should handle all valid change frequencies: %s",
		(changeFrequency) => {
			// @ts-expect-error
			const result = UrlTag.create({ location: validUrl, changeFrequency });
			expect(result.isSucceed).toBe(true);
			expect(result.getValue().toString()).toContain(`<changefreq>${changeFrequency}</changefreq>`);
		},
	);

	it.each([0, 0.1, 0.5, 0.9, 1])("should handle valid priority values: %d", (priority) => {
		const result = UrlTag.create({ location: validUrl, priority });
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toContain(`<priority>${priority.toFixed(1)}</priority>`);
	});
});
