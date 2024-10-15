import { Posts } from "../../src/domain/posts.js";
export class SpreadSheetClientStub {
    _readCount = 0;
    _uploadCount = 0;
    get uploadCount() {
        return this._uploadCount;
    }
    async readPosts() {
        this._readCount++;
        return new Posts([]);
    }
    async fetchPosts(translatedPosts) {
        this._uploadCount++;
        return;
    }
    reset() {
        this._uploadCount = 0;
    }
}
