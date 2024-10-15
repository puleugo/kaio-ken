import {Posts} from "../../src/domain/posts.js";
import {GithubRepositoryInterface} from "../../src/repository/github.repository";

export class GithubClientStub implements GithubRepositoryInterface {
	private _uploadCount: number = 0;

	get uploadCount(): number {
		return this._uploadCount;
	}

	uploadPosts(newPosts: Posts): Promise<Posts> {
		this._uploadCount += newPosts.length;
		return Promise.resolve(newPosts);
	}

	reset() {
		this._uploadCount = 0;
	}
}
