import {RssRepositoryInterface} from "../../src/repository/rss.repository.js";
import {Posts} from "../../src/domain/posts.js";

export class RssRepositoryStub implements RssRepositoryInterface {
	private _posts: any[] = [];

	set posts(posts: any) {
		this._posts.push(posts);
	}

	private _hasRead: number = 0;

	get hasRead(): number {
		return this._hasRead;
	}

	async readNewPosts(): Promise<Posts> {
		this._hasRead++;
		throw new Error("Method not implemented.");
	}

	reset() {
		this._posts = [];
		this._hasRead = 0;
	}
}
