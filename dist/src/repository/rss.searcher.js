import { rssRepository } from "./rss.repository.js";
import { spreadSheetRepository } from "./spread-sheet.repository.js";
export class RssSearcher {
    rssRepository;
    spreadSheetRepository;
    constructor(rssRepository, spreadSheetRepository) {
        this.rssRepository = rssRepository;
        this.spreadSheetRepository = spreadSheetRepository;
    }
    async searchNew() {
        const blog = await this.spreadSheetRepository.readSubscribeBlog();
        const posts = await this.rssRepository.readNewPosts(blog);
        return posts.filterNewPosts(blog.lastPublishedAt);
    }
}
export const rssSearcher = new RssSearcher(rssRepository, spreadSheetRepository);
