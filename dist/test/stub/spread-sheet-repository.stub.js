import { BlogEntity } from "../../src/domain/blog.entity.js";
export class SpreadSheetRepositoryStub {
    _hasUpdatedPost = false;
    _hasRead = false;
    get hasRead() {
        return this._hasRead;
    }
    _hasUpdated = false;
    get hasUpdated() {
        return this._hasUpdated;
    }
    get hasReadPosts() {
        return this._hasUpdatedPost;
    }
    async readPosts() {
        this._hasRead = true;
        throw new Error("Method not implemented.");
    }
    async updateSubscribeBlog(posts) {
        this._hasUpdatedPost = true;
        throw new Error("Method not implemented.");
    }
    reset() {
        this._hasRead = false;
        this._hasUpdatedPost = false;
        this._hasUpdated = false;
    }
    async readSubscribeBlog() {
        return new BlogEntity([]);
    }
}
