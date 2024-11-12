import {spreadSheetUploader, SpreadSheetUploaderInterface} from "./implemention/spread-sheet.uploader";
import {OriginalContentReaderInterface, rssReader} from "./implemention/rss.reader";
import {githubUploader, GithubUploaderInterface} from "./implemention/github.uploader";
import {postReader, PostReaderInterface} from "./implemention/post.reader";
import {postUploader, PostUploader} from "./implemention/post.uploader";
import {chatGptTranslator, TranslatorInterface} from "./implemention/chat-gpt.translator";

export class App {
	constructor(
		private readonly githubUploader: GithubUploaderInterface,
		private readonly spreadSheetUploader: SpreadSheetUploaderInterface,
		private readonly postReader: PostReaderInterface,
		private readonly translator: TranslatorInterface,
		private readonly originalContentReader: OriginalContentReaderInterface,
		private readonly postUploader: PostUploader,
	) {
	}

	async cloneOriginalPostsToGithub() {
		const [posts, blog] = await this.originalContentReader.readBlogsAndPosts();
		const metadata = await this.githubUploader.uploadPosts(posts, blog);
		await this.spreadSheetUploader.fetchPosts(metadata);
	}

	async uploadPosts() {
		const postsByLanguage = await this.postReader.readShouldTranslatePosts();
		const translatedPosts = await this.translator.translatePostsByLanguages(postsByLanguage);
		const uploadedTranslatedPosts = await this.postUploader.upload(translatedPosts);
		const metadata = await this.githubUploader.uploadTranslatedPosts(uploadedTranslatedPosts);
		await this.githubUploader.uploadSitemap(metadata);
	}

	// TODO: 자동 SpreadSheet 업데이트 기능
	async updateSpreadSheetSettings() {}
}

export const app = new App(
	githubUploader,
	spreadSheetUploader,
	postReader,
	chatGptTranslator,
	rssReader,
	postUploader,
)
