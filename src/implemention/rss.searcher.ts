import {Posts} from "../domain/posts";
import {rssRepository, RssRepositoryInterface} from "../repository/rss.repository";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../repository/spread-sheet.repository";

export interface RssSearcherClientInterface {
	searchNew(): Promise<Posts>;
}

export class RssSearcher implements RssSearcherClientInterface {
	constructor(
		private readonly rssRepository: RssRepositoryInterface,
		private readonly spreadSheetRepository: SpreadSheetRepositoryInterface,
	) {
	}

	async searchNew(): Promise<Posts> {
		const blog = await this.spreadSheetRepository.readSubscribeBlog();
		const posts = await this.rssRepository.readNewPosts(blog)
		return posts.filterNewPosts(blog.lastPublishedAt);
	}
}

export const rssSearcher = new RssSearcher(rssRepository, spreadSheetRepository);
