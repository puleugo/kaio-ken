import { githubClient } from "./repository/github.repository.js";
import { spreadSheetUploader } from "./implemention/spread-sheet.uploader.js";
import { rssSearcher } from "./repository/rss.searcher.js";
export class App {
    githubClient;
    spreadSheetClient;
    rssSearchClient;
    constructor(githubClient, spreadSheetClient, 
    // private readonly translateClient: TranslateClientInterface,
    // private readonly qiitaClient: PostWriteClientInterface,
    rssSearchClient) {
        this.githubClient = githubClient;
        this.spreadSheetClient = spreadSheetClient;
        this.rssSearchClient = rssSearchClient;
    }
    // TODO: 동일 글이 여러번 업로드 될 수 있는 문제 해결
    // TODO: 이미지 업로드
    // TODO: RSS를 통해 얻을 수 없는 옛 글 처리
    async generateOriginalPost() {
        const newPosts = await this.rssSearchClient.searchNew();
        if (newPosts.isEmpty)
            return;
        const uploadedPosts = await this.githubClient.uploadPosts(newPosts);
        await this.spreadSheetClient.fetchPosts(uploadedPosts);
    }
    // async uploadPosts() {
    // 	const posts = await this.spreadSheetClient.readPosts();
    // 	if (posts.isEmpty) return;
    // 	const translatedPosts = await this.translateClient.translate(posts);
    // 	await Promise.all([
    // 		this.qiitaClient.upload(translatedPosts),
    // 		this.spreadSheetClient.fetchPosts(translatedPosts)
    // 	]);
    // }
    // TODO: 자동 SpreadSheet 업데이트 기능
    async updateSpreadSheetSettings() { }
}
export const app = new App(githubClient, spreadSheetUploader, rssSearcher);
