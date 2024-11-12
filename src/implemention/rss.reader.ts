import {Posts} from "../domain/posts";
import {rssRepository, RssRepositoryInterface} from "../repository/rss.repository";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../repository/spread-sheet.repository";
import {Blogs} from "../domain/blogs";

export interface OriginalContentReaderInterface {
	readBlogsAndPosts(): Promise<[Posts, Blogs]>;
}

export class RssReader implements OriginalContentReaderInterface {
	constructor(
		private readonly rssRepository: RssRepositoryInterface,
		private readonly spreadSheetRepository: SpreadSheetRepositoryInterface,
	) {
	}

	// RSS로 조회된 게시글과 블로그를 응답합니다.
	async readBlogsAndPosts(): Promise<[Posts, Blogs]> {
		const blogs = await this.spreadSheetRepository.readBlogs();

		const publishBlog = blogs.publisherBlog
		if (!publishBlog) {
			throw new Error('Publisher 블로그를 찾을 수 없습니다.');
		}
		const posts = await this.rssRepository.readPosts(publishBlog)
		return [posts, blogs];
	}
}

export const rssReader = new RssReader(rssRepository, spreadSheetRepository);
