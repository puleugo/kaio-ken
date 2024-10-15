export class GithubClientStub {
    _uploadCount = 0;
    get uploadCount() {
        return this._uploadCount;
    }
    uploadPosts(newPosts) {
        this._uploadCount += newPosts.length;
        return Promise.resolve(newPosts);
    }
    reset() {
        this._uploadCount = 0;
    }
}
