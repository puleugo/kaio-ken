import {Posts} from "../../src/domain/posts";
import {rssRepository, RssRepositoryInterface} from "../../src/repository/rss.repository";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../../src/repository/spread-sheet.repository";
import {OriginalContentsReaderInterface} from "../../src/implemention/rss.reader";
import {Blogs} from "../../src/domain/blogs";

class RssReaderStub implements OriginalContentsReaderInterface {
	constructor(
		private readonly rssRepository: RssRepositoryInterface,
		private readonly spreadSheetRepository: SpreadSheetRepositoryInterface
	) {
	}

	async readBlogsAndPosts(): Promise<[Posts, Blogs]> {
		const blog = await this.spreadSheetRepository.readBlogs();
		const posts = await this.rssRepository.readPosts(blog.publisherBlog);
		return [posts, blog];
	}
}
