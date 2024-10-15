import {Posts} from "../domain/posts.js";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../repository/spread-sheet.repository.js";

export interface SpreadSheetUploaderInterface {
	readPosts(): Promise<Posts>;

	fetchPosts(translatedPosts: Posts): Promise<void>;
}

export class SpreadSheetUploader implements SpreadSheetUploaderInterface {
	constructor(private readonly spreadSheetRepository: SpreadSheetRepositoryInterface) {
	}

	async readPosts(): Promise<Posts> {
		throw new Error("Method not implemented.");
	}

	async fetchPosts(posts: Posts): Promise<void> {
		await this.spreadSheetRepository.updateSubscribeBlog(posts);
	}
}

export const spreadSheetUploader = new SpreadSheetUploader(spreadSheetRepository);
