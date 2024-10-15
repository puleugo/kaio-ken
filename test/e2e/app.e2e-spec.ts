import {App} from "../../src/app.js";
import {GithubClientStub} from "../stub/GithubClientStub.js";
import {PostWriteClientStub} from "../stub/post-write-client.stub.js";
import {TranslateClientStub} from "../stub/translate-client.stub.js";
import {SpreadSheetClientStub} from "../stub/spread-sheet-client.stub.js";
import {RssReadClientStub} from "../stub/rss-read-client.stub.js";
import {PostMother} from "../fixture/PostMother.js";

describe('Application e2e test', () => {
	let app: App;
	let githubClientStub: GithubClientStub;
	let spreadSheetClientStub: SpreadSheetClientStub;
	let translateClientStub: TranslateClientStub
	let qiitaClientStub: PostWriteClientStub;
	let rssSearchClientStub: RssReadClientStub;

	beforeEach(() => {
		githubClientStub = new GithubClientStub();
		spreadSheetClientStub = new SpreadSheetClientStub();
		translateClientStub = new TranslateClientStub();
		qiitaClientStub = new PostWriteClientStub();
		rssSearchClientStub = new RssReadClientStub();

		app = new App(
			githubClientStub,
			spreadSheetClientStub,
			// translateClientStub,
			// qiitaClientStub,
			rssSearchClientStub
		);
	})

	afterEach(() => {
		githubClientStub.reset();
		spreadSheetClientStub.reset();
		translateClientStub.reset();
		qiitaClientStub.reset();
		rssSearchClientStub.reset();
	})

	describe('발행 게시글로부터 원본 게시글 생성', () => {
		it('게시글이 없으면 Github에 업로드하지 않는다.', async () => {
			await app.generateOriginalPost();
			expect(githubClientStub.uploadCount).toBe(0);
		})
		it('게시글이 없으면 SpreadSheet에 업로드하지 않는다.', async () => {
			await app.generateOriginalPost();
			expect(spreadSheetClientStub.uploadCount).toBe(0);
		})
		it('게시글을 Github에 업로드 한다.', async () => {
			rssSearchClientStub.posts = PostMother.createMany(3);
			await app.generateOriginalPost();
			expect(githubClientStub.uploadCount).toBe(3);
		});
		it('게시글을 SpreadSheet에 업로드 한다.', async () => {
			rssSearchClientStub.posts = PostMother.createMany(3);
			await app.generateOriginalPost();
			expect(spreadSheetClientStub.uploadCount).toBe(3);
		});
	})

	describe('구독 블로그에 번역글을 업로드한다.', () => {
		it('번역글이 없으면 Github에 업로드하지 않는다.', async () => {
		})
		it('구독 블로그의 언어수만큼 번역글을 Github에 업로드한다.', async () => {
		});
		it('구독 블로그의 마지막 번역게시글을 갱신한다.')
	})
});
