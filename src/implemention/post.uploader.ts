import {EnvManager, envManager} from "../util/config/env-manager";
import {Metadata} from "../domain/metadata";
import {TranslatedPosts} from "../domain/translatedPosts";
import {BlogPlatformEnum, HrefTagEnum} from "../type";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {githubReader, GithubReaderInterface} from "./github.reader";
import {Posts} from "../domain/posts";
import {PostEntity} from "../domain/postEntity";

export class PostUploader {
	private readonly supportedPlatforms: Map<BlogPlatformEnum, PlatformStrategy> = new Map();
	constructor(private readonly githubReader: GithubReaderInterface, private readonly logger: LoggerInterface) {}

	registerStrategy(platform: BlogPlatformEnum, strategy: PlatformStrategy) {
		this.supportedPlatforms.set(platform, strategy);
	}

	async upload(posts: TranslatedPosts): Promise<TranslatedPosts> {
		const metadata = await this.githubReader.readMetadata();
		const blogs = metadata.blogs.subscribeBlogs;

		const uploadedPosts = await Promise.all(blogs.map(async blog => { // 언어 별 게시글 업로드
			if (!this.supportedPlatforms.has(blog.platform)) {
				throw new Error(`${blog.platform}의 게시글 업로드 기능은 지원되지 않습니다.`);
			}

			// 이미 업로드된 포스트
			const alreadyUploadedPosts = await this.githubReader.readTranslatedPosts(blog.language);
			const platform = this.supportedPlatforms.get(blog.platform);
			const shouldUploadPosts = posts.getComplement(TranslatedPosts.fromPosts(alreadyUploadedPosts)) // 업로드해야하는 게시글 조회가 올바르게 되지 않음.
			const uploadedPosts = await platform.uploadPosts(shouldUploadPosts);
			uploadedPosts.push(alreadyUploadedPosts.toEntities);
			return uploadedPosts;
		}));
		return new TranslatedPosts(uploadedPosts.flatMap(posts => posts.toEntities));
	}

	/**
	 * metadata에 포함된 게시글에 hreflang 정보를 업로드합니다.
	 * @param metadata
	 */
	async uploadHreflang(metadata: Metadata) {
		metadata.blogs.map(async blog => {
			if (!this.supportedPlatforms.has(blog.platform)) {
				throw new Error(`${blog.platform}의 게시글 업로드 기능은 지원되지 않습니다.`);
			}

			const platform = this.supportedPlatforms.get(blog.platform);
			await platform.updatePosts(metadata.posts);
		})
	}
}

export abstract class PlatformStrategy {
	constructor(protected readonly envManager: EnvManager) {
	}

	async uploadPosts(posts: TranslatedPosts): Promise<Posts> {
		await this.authenticateIfNeeded();
		const postEntities = await Promise.all(posts.map(async post => {
			if (!this.isSupportedLanguage(post.language)) {
				return;
			}
			return await this.uploadPost(post);
		}).filter(post => post !== undefined));

		return new Posts(postEntities);
	}

	async updatePosts(posts: Posts): Promise<void> {
		await this.authenticateIfNeeded();
		await Promise.all(posts.map(async post => {
			if (!this.isSupportedLanguage(post.language)) {
				return;
			}
			await this.updatePost(post);
		}));
	}

	protected abstract isSupportedLanguage(language: HrefTagEnum): boolean;
	protected abstract authenticateIfNeeded(): Promise<void>;
	protected abstract uploadPost(post: PostEntity): Promise<PostEntity>;
	protected abstract updatePost(post: PostEntity): Promise<void>
}

export const postUploader = new PostUploader(githubReader, githubActionLogger);
