import { spreadSheetRepository } from "../repository/spread-sheet.repository.js";
export class SpreadSheetUploader {
    spreadSheetRepository;
    constructor(spreadSheetRepository) {
        this.spreadSheetRepository = spreadSheetRepository;
    }
    async readPosts() {
        throw new Error("Method not implemented.");
    }
    async fetchPosts(posts) {
        await this.spreadSheetRepository.updateSubscribeBlog(posts);
    }
}
export const spreadSheetUploader = new SpreadSheetUploader(spreadSheetRepository);
