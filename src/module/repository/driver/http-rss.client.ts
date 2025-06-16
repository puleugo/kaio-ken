import { XMLParser } from "fast-xml-parser";
import { DateUtil } from "../../../shared/util/date.util";
import { BlogType } from "../../domain/blog-type";
import type { BlogEntity } from "../../domain/blog.entity";
import type { RssPostDto } from "../../dto/rss-post.dto";
import { RssParser } from "../../parser/rss.parser";
import type { Logger } from "../logger";
import type { RssClient } from "../rss.repository";
import type { WebClient } from "../web.client";

export class HttpRssClient implements RssClient {
	private readonly xmlParser = new XMLParser({ ignoreAttributes: false });

	constructor(
		private readonly logger: Logger,
		private readonly webClient: WebClient,
	) {}

	async readPosts(blog: BlogEntity): Promise<RssPostDto[]> {
		if (!blog.type.equals(BlogType.PUBLISHER))
			throw new Error(`${blog.title}(${blog.id}, ${blog.title}) blog type is not '${BlogType.PUBLISHER.toString()}'`);
		const rssUrl = blog.rssUrl;
		if (!rssUrl) throw new Error("publisher blog rss url not found");

		this.logger.debug(`블로그 ${blog.title}(${blog.platform})의 새로운 포스트를 확인합니다.`);
		const response = await this.webClient.get().uri(rssUrl.toString()).retrieve();

		const posts = RssParser.getParser(blog.platform).parse(response.rawBody);

		this.logger.debug(`${DateUtil.nowFormatYYYYMMDD} 기준 RSS 게시글 ${posts.length}개를 찾았습니다.`);

		return posts;
	}
}
