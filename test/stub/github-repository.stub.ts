import {GithubRepositoryInterface} from "../../src/repository/github.repository";
import {GithubUploadFile} from "../../src/domain/github-upload-files";
import {Metadata} from "../../src/domain/metadata";

export class GithubRepositoryStub implements GithubRepositoryInterface {
    deleteFile(filePath: string): void {
        throw new Error("Method not implemented.");
    }
	private _uploadCount: number = 0;
	metadata: Metadata | null = null;

	get uploadCount(): number {
		return this._uploadCount;
	}

	reset() {
		this._uploadCount = 0;
	}

	async readOrNull(filePath: string): Promise<string> {
		return "";
	}

	async upload(files: GithubUploadFile[]): Promise<Metadata> {
		this._uploadCount += files.length;
		return this.metadata;
	}

	deleteDirectory(path: string): void {
	}

	getFilesInDirectory(path: string): Promise<any[]> {
		return Promise.resolve([]);
	}
}
