import {Posts} from "../domain/posts";
import {PostEntity} from "../domain/postEntity";
import {XMLParser} from "fast-xml-parser";
import {HrefTagEnum, RssResponse} from "../type";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {BlogEntity} from "../domain/blog.entity";

export interface RssRepositoryInterface {
	// RSS를 통해 게시글을 조회합니다. 조회한 게시글의 ID는 존재하지 않습니다.
	readPosts(blog: BlogEntity): Promise<Posts>;
}

export class RssRepository implements RssRepositoryInterface {
	private readonly xmlParser = new XMLParser();
	constructor(private readonly logger: LoggerInterface) {}

	async readPosts(blog: BlogEntity): Promise<Posts> {
		this.logger.debug(`블로그 ${blog.title}(${blog.platform})의 새로운 포스트를 확인합니다.`);
		const rssRaw = await fetch(blog.rssUrl);
		const body = await rssRaw.text();
		const jsonResult = this.xmlParser.parse(body);
		const rss = jsonResult.rss;

		const posts = this.parsingTistoryRss(rss)
		posts.blog = blog;
		this.logger.debug(`${blog.lastPublishedAt} 이후의 새로운 포스트 ${posts.length}개를 찾았습니다.`);

		return posts;
	}

	private parsingTistoryRss(raw: RssResponse): Posts {
		this.logger.debug('티스토리 RSS를 파싱합니다.');
		const rawPosts = raw.channel.item.sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());
		return new Posts(rawPosts.map(post =>
			new PostEntity({
				title: post.title,
				content: post.description,
				uploadedAt: post.pubDate,
				hasUploadedOnGithub: false,
				originUrl: post.guid,
				language: HrefTagEnum.Korean,
			})
		));
	}
}

export const rssRepository = new RssRepository(githubActionLogger);
