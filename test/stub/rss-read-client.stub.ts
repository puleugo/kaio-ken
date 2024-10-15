import {Posts} from "../../src/domain/posts.js";
import {RssSearcherClientInterface} from "../../src/implemention/rss.searcher";

export class RssReadClientStub implements RssSearcherClientInterface{
	posts: any;
    async searchNew(): Promise<Posts> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
