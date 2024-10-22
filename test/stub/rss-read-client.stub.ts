import {Posts} from "../../src/domain/posts";
import {RssReaderInterface} from "../../src/implemention/rss.reader";
import {Blogs} from "../../src/domain/blogs";

export class RssReadClientStub implements RssReaderInterface{
	posts: any;
    async readBlogsAndPosts(): Promise<[Posts, Blogs]> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
