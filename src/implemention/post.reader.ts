import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {Posts} from "../domain/posts";
import {githubReader, GithubReaderInterface} from "./github-reader";

// GPT에게 번역할 언어 별 게시글을 전달합니다.
export interface ShouldTranslatePostsByLanguage {
	[language: string]: Posts;
}

export interface PostReaderInterface {
	readShouldTranslatePosts(): Promise<ShouldTranslatePostsByLanguage>;
}

export class PostReader implements PostReaderInterface {
	constructor(
		private readonly githubReader: GithubReaderInterface,
		private readonly logger: LoggerInterface,
	) {}

	/**
	 * 구독 블로그에 업로드 할 수 있는 블로그를 조회합니다.
	 */
	async readShouldTranslatePosts(): Promise<ShouldTranslatePostsByLanguage> {
		let dto: ShouldTranslatePostsByLanguage = {};
		this.logger.debug('metadata를 조회합니다.');
		const metadata = await this.githubReader.readMetadata();
		if (metadata === null) {
			throw new Error('metadata가 없습니다.');
		}

		const languages = metadata.blogs.subscribeBlogs.languages;
		const shouldTranslatePostIndexes = new Set<number>();
		languages.forEach((language) => {
			metadata.posts.filterNotTranslatedBy(language).indexes.forEach(index => shouldTranslatePostIndexes.add(index));
		})

		const shouldTranslatePosts: Posts = await this.githubReader.readPosts(metadata.publishBlog.language, shouldTranslatePostIndexes);

		languages.forEach((language) => {
			dto[language] = shouldTranslatePosts.filterNotTranslatedBy(language);
		})

		return dto;
	}
}

export const postReader = new PostReader(githubReader, githubActionLogger);