import {Posts} from "../../src/domain/posts.js";
import {rssRepository, RssRepositoryInterface} from "../../src/repository/rss.repository.js";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../../src/repository/spread-sheet.repository.js";
import {RssSearcherClientInterface} from "../../src/implemention/rss.searcher";

class RssSearcher implements RssSearcherClientInterface {
	constructor(
		private readonly rssRepository: RssRepositoryInterface,
		private readonly spreadSheetRepository: SpreadSheetRepositoryInterface
	) {
	}

	async searchNew(): Promise<Posts> {
		const blog = await this.spreadSheetRepository.readSubscribeBlog();
		return await this.rssRepository.readNewPosts(blog);
	}
}

export const rssSearcherClient = new RssSearcher(rssRepository, spreadSheetRepository);
