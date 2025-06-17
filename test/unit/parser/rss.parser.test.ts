import { BlogPlatform } from "@src/module/domain/blog-platform";
import type { RssPostDto } from "@src/module/dto/rss-post.dto";
import type { RssResponseDto } from "@src/module/dto/rss-response.dto";
import { RssParser } from "@src/module/parser/rss.parser";

class TestRssParser extends RssParser {
	protected parseXml(xml: RssResponseDto): RssPostDto[] {
		return xml.rss.channel.item.map((item) => ({
			title: item.title,
			link: item.link,
			description: item.description,
			guid: item.guid,
			pubDate: new Date(item.pubDate),
		}));
	}
}

describe("RssParser", () => {
	describe("parse", () => {
		it("should parse valid RSS XML", () => {
			const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss>
  <channel>
    <item>
      <title>Test Post 1</title>
      <link>https://example.com/post1</link>
      <description>Test description 1</description>
      <guid>https://example.com/post1</guid>
      <pubDate>Wed, 20 Mar 2024 12:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Test Post 2</title>
      <link>https://example.com/post2</link>
      <description>Test description 2</description>
      <guid>https://example.com/post2</guid>
      <pubDate>Wed, 20 Mar 2024 13:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

			const parser = new TestRssParser();
			const result = parser.parse(xml);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				title: "Test Post 1",
				link: "https://example.com/post1",
				description: "Test description 1",
				guid: "https://example.com/post1",
				pubDate: new Date("Wed, 20 Mar 2024 12:00:00 GMT"),
			});
			expect(result[1]).toEqual({
				title: "Test Post 2",
				link: "https://example.com/post2",
				description: "Test description 2",
				guid: "https://example.com/post2",
				pubDate: new Date("Wed, 20 Mar 2024 13:00:00 GMT"),
			});
		});

		it("should throw error for invalid XML format", () => {
			const invalidXml = "invalid xml";
			const parser = new TestRssParser();
			expect(() => parser.parse(invalidXml)).toThrow();
		});
	});

	describe("static methods", () => {
		it("should register and get parser for platform", () => {
			const platform = BlogPlatform.from("medium").getValue();
			RssParser.register(platform, new TestRssParser());

			const parser = RssParser.getParser(platform);
			expect(parser).toBeInstanceOf(TestRssParser);
		});

		it("should throw error for unregistered platform", () => {
			const result = BlogPlatform.from("unknown");
			expect(() => RssParser.getParser(result.getValue())).toThrow();
		});
	});
});
