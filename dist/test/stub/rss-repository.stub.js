export class RssRepositoryStub {
    _posts = [];
    set posts(posts) {
        this._posts.push(posts);
    }
    _hasRead = 0;
    get hasRead() {
        return this._hasRead;
    }
    async readNewPosts() {
        this._hasRead++;
        throw new Error("Method not implemented.");
    }
    reset() {
        this._posts = [];
        this._hasRead = 0;
    }
}
