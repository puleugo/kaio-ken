import { rssRepository } from "../../src/repository/rss.repository.js";
import { spreadSheetRepository } from "../../src/repository/spread-sheet.repository.js";
class RssSearcher {
    rssRepository;
    spreadSheetRepository;
    constructor(rssRepository, spreadSheetRepository) {
        this.rssRepository = rssRepository;
        this.spreadSheetRepository = spreadSheetRepository;
    }
    async searchNew() {
        const blog = await this.spreadSheetRepository.readSubscribeBlog();
        return await this.rssRepository.readNewPosts(blog);
    }
}
export const rssSearcherClient = new RssSearcher(rssRepository, spreadSheetRepository);
