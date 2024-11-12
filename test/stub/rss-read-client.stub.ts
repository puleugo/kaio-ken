import {Posts} from "../../src/domain/posts";
import {OriginalContentReaderInterface} from "../../src/implemention/rss.reader";
import {Blogs} from "../../src/domain/blogs";

export class RssReadClientStub implements OriginalContentReaderInterface{
	posts: any;
    async readBlogsAndPosts(): Promise<[Posts, Blogs]> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
