import {App} from "../../src/app";
import {githubUploader} from "../../src/implemention/github.uploader";
import {spreadSheetUploader} from "../../src/implemention/spread-sheet.uploader";
import {rssReader} from "../../src/implemention/rss.reader";
import {envManager} from "../../src/util/config/env-manager";
import 'dotenv/config'

describe('Application e2e test', () => {
	let app: App;

	beforeEach(() => {
		envManager.putOrThrow('GH_REPOSITORY', process.env['GH_REPOSITORY']);
		envManager.putOrThrow('GH_TOKEN', process.env['GH_TOKEN']);
		envManager.putOrThrow('GH_USER', process.env['GH_USER']);
		envManager.putOrThrow('GOOGLE_SHEET_ID', process.env['GOOGLE_SHEET_ID']);
		envManager.putOrThrow('GOOGLE_CLIENT_EMAIL', process.env['GOOGLE_CLIENT_EMAIL']);
		envManager.putOrThrow('GOOGLE_PRIVATE_KEY', process.env['GOOGLE_PRIVATE_KEY']);
		app = new App(
			githubUploader,
			spreadSheetUploader,
			// translateClientStub,
			// qiitaClientStub,
			rssReader,
		);
	})

	afterEach(() => {})

	describe('발행 게시글로부터 원본 게시글 생성', () => {
		it('게시글이 없으면 Github에 업로드하지 않는다.', async () => {
			await app.generateOriginalPost();
		})
		it('게시글이 없으면 SpreadSheet에 업로드하지 않는다.', async () => {
			// await app.generateOriginalPost();
		})
		it('게시글을 Github에 업로드 한다.', async () => {
			// await app.generateOriginalPost();
		});
		it('게시글을 SpreadSheet에 업로드 한다.', async () => {
			// await app.generateOriginalPost();
		});
	})

	describe('구독 블로그에 번역글을 업로드한다.', () => {
		it.todo('번역글이 없으면 Github에 업로드하지 않는다.')
		it.todo('구독 블로그의 언어수만큼 번역글을 Github에 업로드한다.');
		it.todo('구독 블로그의 마지막 번역게시글을 갱신한다.')
	})
});
