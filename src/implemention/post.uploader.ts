import {Posts} from "../domain/posts";
import {envManager, EnvManager} from "../util/config/env-manager";
import axios from "axios";
import {PostEntity} from "../domain/postEntity";
import {Metadata} from "../domain/metadata";
import {TranslatedPosts} from "../domain/translatedPosts";
import {BlogPlatformEnum} from "../type";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";

export class PostUploader {
	private _platform: PlatformStrategy;
	private readonly supportedPlatforms: Map<BlogPlatformEnum, PlatformStrategy> = new Map();
	constructor(private readonly logger: LoggerInterface) {}

	registerStrategy(platform: BlogPlatformEnum, strategy: PlatformStrategy) {
		this.supportedPlatforms.set(platform, strategy);
	}

	private set platform(platform: PlatformStrategy) {
		this._platform = platform;
	}

	async upload(metadata: Metadata, posts: TranslatedPosts): Promise<Metadata> {
		const blogs = metadata.blogs.subscribeBlogs;
		blogs.forEach(blog => {
			if (!this.supportedPlatforms.has(blog.platform)) {
				throw new Error(`${blog.platform}의 게시글 업로드 기능은 지원되지 않습니다.`);
			}

			this.platform = this.supportedPlatforms.get(blog.platform);
			return this._platform.upload(posts);
		})
		return metadata
	}
}

export interface PlatformStrategy {
	upload(posts: TranslatedPosts): Promise<Posts>;
}

export class MediumStrategy implements PlatformStrategy{
	constructor(private readonly envManager: EnvManager) {}

	private readonly mediumApiUrl = 'https://api.medium.com';

    async upload(posts: TranslatedPosts): Promise<Posts> {
	    const token = this.envManager.getOrThrow('MEDIUM_TOKEN');
	    const userId = await this.getUserId(token);
	    const translatedPosts = await posts.map(async (post): Promise<PostEntity> => {
			const result = await axios.post(`${this.mediumApiUrl}/v1/users/${userId}/posts`,
				{
					'title': post.title,
					'contentFormat': 'markdown',
					'content': post.content,
					'publishStatus': 'draft'
				},
				{
					headers: {Authorization: `Bearer ${token}`},
					validateStatus: (status => status < 500)
				});
			return post.originUrl = result.data.data.url;
		})
		return new Posts(translatedPosts);
    }

	private async getUserId(token: string): Promise<string> {
		const result = await axios.get(`${this.mediumApiUrl}/v1/me`, {
			headers: {Authorization: `Bearer ${token}`},
			validateStatus: (status => status < 500)
		})
		if (result.status !== 200) {
			throw new Error('Medium API 호출에 실패했습니다.');
		}
		return result.data.data.id;
	}
}

export const postUploader = new PostUploader(githubActionLogger);
postUploader.registerStrategy(BlogPlatformEnum.Medium, new MediumStrategy(envManager));
