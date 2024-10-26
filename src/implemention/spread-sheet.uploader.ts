import {Posts} from "../domain/posts";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../repository/spread-sheet.repository";
import {Metadata} from "../domain/metadata";

export interface SpreadSheetUploaderInterface {
	readPosts(): Promise<Posts>;

	fetchPosts(metadata: Metadata): Promise<void>;
}

export class SpreadSheetUploader implements SpreadSheetUploaderInterface {
	constructor(private readonly spreadSheetRepository: SpreadSheetRepositoryInterface) {
	}

	async readPosts(): Promise<Posts> {
		throw new Error("Method not implemented.");
	}

	async fetchPosts(metadata: Metadata): Promise<void> {
		await this.spreadSheetRepository.updatePublisherBlog(metadata.posts, metadata.publishBlog);
	}
}

export const spreadSheetUploader = new SpreadSheetUploader(spreadSheetRepository);
