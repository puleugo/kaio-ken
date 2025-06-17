import { Language } from "@src/module/domain/language";
import { UrlTag } from "@src/module/domain/url-tag";
import { XhtmlTag } from "@src/module/domain/xhtml-tag";
import { SitemapXmlParser } from "@src/module/parser/sitemap-xml-parser";

type ChangeFrequentProperty = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

describe("Sitemap", () => {
	const createUrlTag = (loc: string, lastmod?: string, changefreq?: ChangeFrequentProperty, priority?: number) => {
		return UrlTag.create({
			location: new URL(loc),
			lastModified: lastmod ? new Date(lastmod) : undefined,
			changeFrequency: changefreq,
			priority,
		}).getValue();
	};

	const createXhtmlTag = (loc: string, lang: string, href: string) => {
		return XhtmlTag.create({ location: new URL(loc), language: Language.from(lang).getValue(), href: new URL(href) });
	};

	it("should create sitemap from valid XML", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com</loc>
					<lastmod>2024-03-20T12:00:00+09:00</lastmod>
					<changefreq>daily</changefreq>
					<priority>1.0</priority>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		expect(sitemap.toString()).toContain("https://example.com");
		expect(sitemap.toString()).toContain("2024-03-20");
		expect(sitemap.toString()).toContain("daily");
		expect(sitemap.toString()).toContain("1.0");
	});

	it("should fail to create sitemap from invalid XML", () => {
		const xml = "invalid xml";
		expect(() => SitemapXmlParser.fromString(xml)).toThrow("Invalid XML format");
	});

	it("should add URL tag to sitemap", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		const newUrl = createUrlTag("https://example.com/new", "2024-03-20", "daily", 0.8);
		const updatedUrlSet = sitemap.urlSet.putUrl(newUrl);

		expect(updatedUrlSet.toString()).toContain("https://example.com/new");
		expect(updatedUrlSet.toString()).toContain("2024-03-20");
		expect(updatedUrlSet.toString()).toContain("daily");
		expect(updatedUrlSet.toString()).toContain("0.8");
	});

	it("should add XHTML link to existing URL", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		const xhtmlTag = createXhtmlTag("https://example.com", "en", "https://example.com/en").getValue();
		const updatedUrlSet = sitemap.urlSet.putXhtml(xhtmlTag);

		expect(updatedUrlSet.toString()).toContain('rel="alternate"');
		expect(updatedUrlSet.toString()).toContain('hreflang="en"');
		expect(updatedUrlSet.toString()).toContain('href="https://example.com/en"');
	});

	it("should throw error when adding XHTML link to non-existent URL", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		const xhtmlTag = createXhtmlTag(
			"https://example.com/nonexistent",
			"en",
			"https://example.com/nonexistent/en",
		).getValue();

		expect(() => sitemap.urlSet.putXhtml(xhtmlTag)).toThrow(
			"Cannot put xhtml tag to url set, because there is no url with the same location",
		);
	});

	it("should handle multiple XHTML links for the same URL", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		const xhtmlTag1 = createXhtmlTag("https://example.com", "en", "https://example.com/en").getValue();
		const xhtmlTag2 = createXhtmlTag("https://example.com", "ja", "https://example.com/ja").getValue();

		const updatedSitemap = sitemap.urlSet.putXhtml(xhtmlTag1).putXhtml(xhtmlTag2);
		const xmlOutput = updatedSitemap.toString();

		expect(xmlOutput).toContain('hreflang="en"');
		expect(xmlOutput).toContain('hreflang="ja"');
		expect(xmlOutput).toContain('href="https://example.com/en"');
		expect(xmlOutput).toContain('href="https://example.com/ja"');
	});

	it("should handle single URL in XML", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		expect(sitemap.toString()).toContain("https://example.com");
	});

	it("should handle multiple URLs in XML", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>https://example.com/1</loc>
				</url>
				<url>
					<loc>https://example.com/2</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		expect(sitemap.toString()).toContain("https://example.com/1");
		expect(sitemap.toString()).toContain("https://example.com/2");
	});

	it("should use default xmlns when not provided", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<urlset>
				<url>
					<loc>https://example.com</loc>
				</url>
			</urlset>`;

		const sitemap = SitemapXmlParser.fromString(xml);
		expect(sitemap.toString()).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
	});
});
