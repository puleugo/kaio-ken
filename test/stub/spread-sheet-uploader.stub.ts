import {Posts} from "../../src/domain/posts";
import {SpreadSheetUploaderInterface} from "../../src/implemention/spread-sheet.uploader";

export class SpreadSheetUploaderStub implements SpreadSheetUploaderInterface {
	private _readCount: number = 0;

	private _uploadCount: number = 0;

	get uploadCount(): number {
		return this._uploadCount;
	}

	async readPosts(): Promise<Posts> {
		this._readCount++;
		return new Posts([]);
	}

	async fetchPosts(translatedPosts: Posts): Promise<void> {
		this._uploadCount++;
		return;
	}

	reset() {
		this._uploadCount = 0;
	}
}
