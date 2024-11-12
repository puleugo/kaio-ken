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
	// RSS로 조회된 게시글과 블로그를 업로드합니다.
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
		// TODO: Builder 사용하지 않고 구현하기
		await this.githubRepository.upload(
			new GithubUploadFileBuilder()
				.addTranslatedPosts(translatedPosts)
				.putMetadata(metadata)
				.build()
		);

		return metadata;
    }

	async uploadPosts(posts: Posts, blogs: Blogs): Promise<Metadata> {
		if (posts.isEmpty){
			throw new Error('게시글이 없어 업로드를 진행하지 않습니다.');
		}
		this.logger.debug('게시글이 발견되어 업로드를 진행합니다.');
		let metadata = await this.githubReader.readMetadata();
		if (!metadata) { // 메타데이터가 존재하지 않으면 새로운 게시글과 메타데이터를 새로 생성
			metadata = new Metadata({posts: posts, blogs});
			await this.githubRepository.upload([...posts.toGithubUploadFiles, metadata.githubUploadFile,]);
			return metadata;
		}
		// 메타데이터가 존재한다면 일부의 새로운 게시글과 업데이트된 메타데이터 업로드
		const newPosts = posts.getComplement(metadata.posts);
		metadata.update(posts, blogs);
		await this.githubRepository.upload([...newPosts.toGithubUploadFiles, metadata.githubUploadFile,]);
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
