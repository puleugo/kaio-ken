import {envManager, EnvManager} from "../../util/config/env-manager";
import axios from "axios";
import {PlatformStrategy, postUploader} from "../post.uploader";
import {PostEntity} from "../../domain/postEntity";
import {BlogPlatformEnum, HrefTagEnum} from "../../type";

/**
 * Medium API를 이용한 포스트 업로드 전략
 * @see https://github.com/Medium/medium-api-docs?tab=readme-ov-file#33-posts
 */
export class MediumStrategy extends PlatformStrategy {

	constructor(envManager: EnvManager) {
		super(envManager);
	}

	private readonly mediumApiUrl = 'https://api.medium.com';
	private token: string;
	private userId: string;

	protected async authenticateIfNeeded() {
		if (this.token && this.userId) {
			return;
		}
		this.token = this.envManager.getOrThrow('MEDIUM_TOKEN');
		this.userId = await this.getUserId(this.token);
		return;
	}

	protected async uploadPost(post: PostEntity): Promise<PostEntity> {
		const result = await axios.post(`${this.mediumApiUrl}/v1/users/${this.userId}/posts`,
			{
				'title': post.title, // 이 제목은 SEO를 위해 사용된 100자가 넘을 시 무시됨
				'contentFormat': 'markdown',
				'content': `<h1>${post.title}</h1> `+post.content, // 콘텐츠에 h1을 추가해야 함.
				'publishStatus': 'public'
			},
			{
				headers: {Authorization: `Bearer ${this.token}`},
				validateStatus: (status => status < 400)
			}
		);
		post.originUrl = result.data.data.url;
		return post;
	}

	protected async updatePost(post: PostEntity): Promise<void> {
		const token = this.envManager.getOrThrow('MEDIUM_TOKEN');
		const userId = await this.getUserId(token);
	}

	protected isSupportedLanguage(language: HrefTagEnum): boolean {
		return language === HrefTagEnum.English;
	}

	private async getUserId(token: string): Promise<string> {
		try {
			const result = await axios.get(`${this.mediumApiUrl}/v1/me`, {
				headers: {Authorization: `Bearer ${token}`},
				validateStatus: (status => status < 400)
			})
			if (result.status !== 200) {
				throw new Error('Medium API 호출에 실패했습니다.');
			}
			return result.data.data.id;
		} catch (e) {
			throw e;
		}
	}
}

postUploader.registerStrategy(BlogPlatformEnum.Medium, new MediumStrategy(envManager));
