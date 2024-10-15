import { Posts } from "../domain/posts.js";
import { PostEntity } from "../domain/postEntity.js";
import { XMLParser } from "fast-xml-parser";
import { HrefTagEnum } from "../type.js";
export class RssRepository {
    xmlParser = new XMLParser();
    async readNewPosts(blog) {
        const rssRaw = await fetch(blog.rssUrl);
        const body = await rssRaw.text();
        const jsonResult = this.xmlParser.parse(body);
        const rss = jsonResult.rss;
        const posts = this.parsingTistoryRss(rss, blog.lastPublishedIndex + 1);
        return new Posts(posts, blog).filterNewPosts(blog.lastPublishedAt);
    }
    parsingTistoryRss(raw, startIndex) {
        const posts = raw.channel.item.sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());
        return posts.map(post => {
            const result = new PostEntity({
                title: post.title,
                content: post.description,
                uploadedAt: post.pubDate,
                hasUploadedOnGithub: false,
                originUrl: post.guid,
                language: HrefTagEnum.Korean,
            }, startIndex);
            startIndex++;
            return result;
        });
    }
}
export const rssRepository = new RssRepository();
