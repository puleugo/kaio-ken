import {Blogs} from "../domain/blogs";
import {spreadSheetRepository, SpreadSheetRepositoryInterface} from "../repository/spread-sheet.repository";

export interface SpreadSheetReaderInterface {
	readBlogs(): Promise<Blogs>;
}

class SpreadSheetReader implements SpreadSheetReaderInterface {
	constructor(private readonly spreadSheetRepository: SpreadSheetRepositoryInterface) {}

	async readBlogs(): Promise<Blogs> {
		return this.spreadSheetRepository.readBlogs();
	}
}

export const spreadSheetReader = new SpreadSheetReader(spreadSheetRepository);
