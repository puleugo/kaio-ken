import {Posts} from "../../src/domain/posts";
import {OriginalContentsReaderInterface} from "../../src/implemention/rss.reader";
import {Blogs} from "../../src/domain/blogs";

export class RssReadClientStub implements OriginalContentsReaderInterface{
	posts: any;
    async readBlogsAndPosts(): Promise<[Posts, Blogs]> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
