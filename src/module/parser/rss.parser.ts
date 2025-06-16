import { XMLParser } from "fast-xml-parser";
import type { BlogPlatform } from "../domain/blog-platform";
import type { RssPostDto } from "../dto/rss-post.dto";
import type { RssResponseDto } from "../dto/rss-response.dto";

export abstract class RssParser {
	private static registry: Map<string, RssParser> = new Map();
	protected xmlParser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
	});

	parse(xml: string): RssPostDto[] {
		const result = this.xmlParser.parse(xml);
		return this.parseXml(result);
	}

	protected abstract parseXml(xml: RssResponseDto): RssPostDto[];

	static getParser(platform: BlogPlatform): RssParser {
		const key = platform.toString();
		const parser = RssParser.registry.get(key);
		if (!parser) throw Error(`${platform.toString()} has not supported`);

		return parser;
	}

	static register(platform: BlogPlatform, parser: RssParser) {
		RssParser.registry.set(platform.toString(), parser);
	}
}
