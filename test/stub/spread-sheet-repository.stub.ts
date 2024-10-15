import {SpreadSheetRepositoryInterface} from "../../src/repository/spread-sheet.repository.js";
import {Posts} from "../../src/domain/posts.js";
import {BlogEntity} from "../../src/domain/blog.entity.js";

export class SpreadSheetRepositoryStub implements SpreadSheetRepositoryInterface {
	private _hasUpdatedPost: boolean = false;

	private _hasRead: boolean = false;

	get hasRead(): boolean {
		return this._hasRead;
	}

	private _hasUpdated: boolean = false;

	get hasUpdated(): boolean {
		return this._hasUpdated;
	}

	get hasReadPosts(): boolean {
		return this._hasUpdatedPost;
	}

	async readPosts(): Promise<Posts> {
		this._hasRead = true;
		throw new Error("Method not implemented.");
	}

	async updateSubscribeBlog(posts: Posts): Promise<void> {
		this._hasUpdatedPost = true;
		throw new Error("Method not implemented.");
	}

	reset() {
		this._hasRead = false;
		this._hasUpdatedPost = false;
		this._hasUpdated = false;
	}

	async readSubscribeBlog(): Promise<BlogEntity> {
		return new BlogEntity([]);
	}
}
