import {Posts} from "../domain/posts";
import {githubRepository, GithubRepositoryInterface} from "../repository/github.repository";
import {Metadata} from "../domain/metadata";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {GithubUploadFileBuilder} from "../domain/github-upload-files";
import {Blogs} from "../domain/blogs";
import {TranslatedPosts} from "../domain/translatedPosts";
import {githubReader, GithubReaderInterface} from "./github.reader";
import {Sitemap} from "../domain/sitemap";
import {spreadSheetUploader, SpreadSheetUploaderInterface} from "./spread-sheet.uploader";
import {spreadSheetReader, SpreadSheetReaderInterface} from "./spread-sheet.reader";

export interface GithubUploaderInterface {
	uploadPosts(ports: Posts, blogs: Blogs): Promise<Metadata>;

	uploadTranslatedPosts(translatedPosts: TranslatedPosts): Promise<Metadata>;

	uploadSitemap(metadata: Metadata): Promise<void>;
}


export class GithubUploader implements GithubUploaderInterface{
	constructor(
		private readonly githubReader: GithubReaderInterface,
		private readonly githubRepository: GithubRepositoryInterface,
		private readonly spreadSheetUploader: SpreadSheetUploaderInterface,
		private readonly spreadSheetReader: SpreadSheetReaderInterface,
		private readonly logger: LoggerInterface
	) {}


	async uploadTranslatedPosts(translatedPosts: TranslatedPosts): Promise<Metadata> {
		const jsonString = await this.githubRepository.readOrNull(Metadata.path);
		if (jsonString === null) {
			throw new Error('metadata가 없어 업로드를 진행하지 않습니다.');
		}
		const metadata: Metadata = new Metadata(JSON.parse(jsonString));
		metadata.addTranslatedPost(translatedPosts)
		await this.githubRepository.upload(
			new GithubUploadFileBuilder()
				.addTranslatedPosts(translatedPosts)
				.putMetadata(metadata)
				.build()
		);

		return metadata;
    }

	async uploadPosts(newPosts: Posts, blogs: Blogs): Promise<Metadata> {
		if (newPosts.isEmpty){
			throw new Error('새로운 포스트가 없어 업로드를 진행하지 않습니다.');
		}
		this.logger.debug('새로운 포스트가 발견되어 업로드를 진행합니다.');
		const jsonString = await this.githubRepository.readOrNull(Metadata.path);
		const metadata: Metadata = jsonString ? new Metadata(JSON.parse(jsonString)) : new Metadata({posts: newPosts, blogs});

		await this.githubRepository.upload(
			new GithubUploadFileBuilder()
				.addPosts(newPosts)
				.putBlogs(blogs)
				.putMetadata(metadata)
				.build()
		);
		return metadata
	}

	async uploadSitemap(metadata: Metadata): Promise<void> {
		const sitemap = await this.githubReader.readSitemap();
		sitemap.update(metadata);
		if (sitemap.isEmpty) {
			return
		}
		await Promise.all([
			this.githubRepository.upload([{path: Sitemap.path, content: sitemap.value}]),
			this.spreadSheetUploader.fetchPosts(metadata)
		]);

	}
}

export const githubUploader = new GithubUploader(githubReader, githubRepository, spreadSheetUploader, spreadSheetReader, githubActionLogger);
