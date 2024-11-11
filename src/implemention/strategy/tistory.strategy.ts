import {envManager, EnvManager} from "../../util/config/env-manager";
import axios from "axios";
import * as cheerio from "cheerio";
import {PlatformStrategy, postUploader} from "../post.uploader";
import {BlogPlatformEnum, HrefTagEnum} from "../../type";
import {PostEntity} from "../../domain/postEntity";

interface TistoryPutPostDto {
	id: string;
	title: string;
	content: string; // 필수: HTML 형식
	slogan: string;
	visibility: number;
	category: number;
	tag: string;
	acceptComment: number;
	published: number;
	password: string;
	uselessMarginForEntry: number;
	daumLike: '404';
	cclCommercial: 2;
	cclDerive: 1;
	thumbnail: string; // 필수
	type: 'post';
	attachments: Array<string> // 이미지 CDN ID 어레이
	recaptchaValue: string;
	draftSequence: 'null';
	challengeCode: '';
}

// FIXME: API 호출 시 기존 브라우저의 로그인이 풀림.
export class TistoryStrategy extends PlatformStrategy {

	private session: string;
	private cookieHeader: { headers: { 'Cookie': string } };

	constructor(envManager: EnvManager) {
		super(envManager);
	}

	protected async authenticateIfNeeded() {
		if (!this.session) {
			this.session = this.envManager.getOrThrow('TISTORY_SESSION');
		}

		this.session = this.envManager.getOrThrow('TISTORY_SESSION');
		this.cookieHeader = {headers: {'Cookie': `TSSESSION=${this.session}`,}}
	}

	protected async uploadPost(posts: PostEntity): Promise<PostEntity> {
		throw new Error('Method not implemented.');
	}

	protected isSupportedLanguage(language: HrefTagEnum): boolean {
		return language === HrefTagEnum.Korean;
	}

	protected async updatePost(post: PostEntity): Promise<void> {
		const blogName = post.originUrl.match(/https:\/\/([^.]+)\.tistory\.com/)[1];

		const tistoryPostId = post.originUrl.match(/https:\/\/[^/]+\/(\d+)/)[1];

		// 기존 게시글의 업데이트 폼 조회
		const rawPostResponse = await axios.get(`https://${blogName}.tistory.com/manage/newpost/${tistoryPostId}?type=post&returnURL=ENTRY`, this.cookieHeader);
		const rawPostContent = rawPostResponse.data;
		const form = cheerio.load(rawPostContent)('#editor-root')
		const jsScript = form.find('script').first().html();

		// 업데이트 폼 생성
		const configScript = `${jsScript}; return window.Config;`;
		const configFunction = new Function('window', configScript);
		const json = {};  // 가상 window 객체 생성
		const result = configFunction(json)
		const dto = result['post'] as TistoryPutPostDto
		dto.content = post.hrefLangInjectionCode + dto.content;

		// 업데이트
		await axios.put(`https://${blogName}.tistory.com/manage/post/${tistoryPostId}.json`, dto, this.cookieHeader);
	}
}

postUploader.registerStrategy(BlogPlatformEnum.Tistory, new TistoryStrategy(envManager))
