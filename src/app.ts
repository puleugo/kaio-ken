import {spreadSheetUploader, SpreadSheetUploaderInterface} from "./implemention/spread-sheet.uploader";
import {rssReader, OriginalContentsReaderInterface} from "./implemention/rss.reader";
import {githubUploader, GithubUploaderInterface} from "./implemention/github.uploader";

export class App {
	constructor(
		private readonly githubUploader: GithubUploaderInterface,
		private readonly spreadSheetUploader: SpreadSheetUploaderInterface,
		// private readonly translateClient: TranslateClientInterface,
		// private readonly qiitaClient: PostWriteClientInterface,
		private readonly originalContentsReader: OriginalContentsReaderInterface
	) {
	}

	async cloneOriginalPostsToGithub() {
		const [newPosts, blog] = await this.originalContentsReader.readBlogsAndPosts();
		const metadata = await this.githubUploader.uploadPosts(newPosts, blog);
		await this.spreadSheetUploader.fetchPosts(metadata);
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
	async updateSpreadSheetSettings() {}
}

export const app = new App(githubUploader, spreadSheetUploader, rssReader)
