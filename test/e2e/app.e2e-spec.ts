import {App} from "../../src/app";
import {githubUploader} from "../../src/implemention/github.uploader";
import {spreadSheetUploader} from "../../src/implemention/spread-sheet.uploader";
import {rssReader} from "../../src/implemention/rss.reader";

// TODO: .env 추가해서 e2e 테스트 환경 구축
describe('Application e2e test', () => {
	let app: App;

	beforeEach(() => {
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
			await app.generateOriginalPost();
		})
		it('게시글을 Github에 업로드 한다.', async () => {
			await app.generateOriginalPost();
		});
		it('게시글을 SpreadSheet에 업로드 한다.', async () => {
			await app.generateOriginalPost();
		});
	})

	describe('구독 블로그에 번역글을 업로드한다.', () => {
		it.todo('번역글이 없으면 Github에 업로드하지 않는다.')
		it.todo('구독 블로그의 언어수만큼 번역글을 Github에 업로드한다.');
		it.todo('구독 블로그의 마지막 번역게시글을 갱신한다.')
	})
});
