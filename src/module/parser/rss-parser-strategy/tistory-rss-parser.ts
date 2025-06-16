import type { RssPostDto } from "../../dto/rss-post.dto";
import type { RssResponseDto } from "../../dto/rss-response.dto";
import { RssParser } from "../rss.parser";

export class TistoryRssParser extends RssParser {
	parseXml(response: RssResponseDto): RssPostDto[] {
		const rawPosts = response.rss.channel.item.sort(
			(a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime(),
		);
		return rawPosts.map(
			(raw): RssPostDto => ({
				title: raw.title,
				link: raw.guid,
				description: raw.description,
				guid: raw.guid,
				pubDate: new Date(raw.pubDate),
			}),
		);
	}
}
