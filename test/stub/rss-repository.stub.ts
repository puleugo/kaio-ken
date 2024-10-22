import {RssRepositoryInterface} from "../../src/repository/rss.repository";
import {Posts} from "../../src/domain/posts";

export class RssRepositoryStub implements RssRepositoryInterface {
	private _posts: Posts;
	private _readCount: number = 0;

	set posts(posts: Posts) {
		this._posts = posts;
	}

	get hasRead(): boolean {
		return this._readCount > 0;
	}

	async readPosts(): Promise<Posts> {
		this._readCount++;
		return this._posts;
	}

	reset() {
		this._posts = new Posts([]);
		this._readCount = 0;
	}
}
