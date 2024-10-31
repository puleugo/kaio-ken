import {App} from "../../src/app";
import {githubUploader} from "../../src/implemention/github.uploader";
import {spreadSheetUploader} from "../../src/implemention/spread-sheet.uploader";
import {rssReader} from "../../src/implemention/rss.reader";
import {envManager} from "../../src/util/config/env-manager";
import 'dotenv/config'
import {SpreadSheetMother} from "../fixture/spread-sheet.mother";
import {SpreadSheetRepository, spreadSheetRepository} from "../../src/repository/spread-sheet.repository";
import {githubActionLogger} from "../../src/util/logger/github-action.logger";
import {GithubRepository, githubRepository} from "../../src/repository/github.repository";
import {Metadata, MetadataJson} from "../../src/domain/metadata";
import {Blogs} from "../../src/domain/blogs";
import {DateUtil} from "../../src/util/util/DateUtil";
import {MetadataMother} from "../fixture/metadata.mother";
import {postReader} from "../../src/implemention/post.reader";
import {postUploader} from "../../src/implemention/post.uploader";
import {TranslateClientStub} from "../stub/translate-client.stub";
import {chatGptTranslator} from "../../src/implemention/chat-gpt.translator";

describe('Application e2e test', () => {
	jest.setTimeout(1000 * 60 * 10);
	let app: App;
	let spreadSheetFactory: SpreadSheetRepository;
	let githubFactory: GithubRepository;

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
			postReader,
			chatGptTranslator,
			// new TranslateClientStub(),
			rssReader,
			postUploader,
		);
		spreadSheetFactory = new SpreadSheetRepository(envManager, githubActionLogger);
		githubFactory = new GithubRepository(envManager, githubActionLogger);
	})

	afterEach(async () => {
		await Promise.all([
			// await spreadSheetRepository.truncate('Posts!A2:Z100'),
			// spreadSheetRepository.truncate('Blogs!A2:F100'),
			// githubFactory.deleteFile('metadata.json'),
			// githubFactory.deleteDirectory('ko-KR'),
		]);
	})

	describe('발행 게시글로부터 원본 게시글 생성', () => {
		describe('케이스: 최초 실행', () => {
			it('Github에 메타데이터를 업로드한다.', async () => {
				await spreadSheetFactory.write({range: 'Blogs!A2:F100', values: SpreadSheetMother.blogRows()});

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				expect(metadata).not.toBeNull();
			})
			it('메타데이터의 마지막 실행일이 오늘 날짜이다.', async () => {
				await spreadSheetFactory.write({range: 'Blogs!A2:F100', values: SpreadSheetMother.blogRows()});

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				const metadataJson: MetadataJson = JSON.parse(metadata);
				expect(metadataJson).toHaveProperty('lastExecutedAt');
				expect(metadataJson.lastExecutedAt).toBe(DateUtil.nowFormatYYYYMMDD);
			})
			it('메타데이터의 게시글 정보가 포함된다.',async () => {
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: SpreadSheetMother.blogRows()});

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				expect(metadata).toContain('posts');
				return;
			})
			it('메타데이터의 게시글 정보가 올바르다.', async () => {
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: SpreadSheetMother.blogRows()});
				const [posts, _] = await rssReader.readBlogsAndPosts();

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				const metadataJson: MetadataJson = JSON.parse(metadata);
				expect(Object.keys(metadataJson.posts)).toHaveLength(posts.length);
			})
			it('메타데이터의 블로그 정보가 포함된다.', async () => {
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: SpreadSheetMother.blogRows()});

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				expect(metadata).toContain('blogs');
			})
			it('메타데이터의 블로그 정보가 올바르다.', async () => {
				const blogRows = SpreadSheetMother.blogRows();
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: blogRows});

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				const metadataJson: MetadataJson = JSON.parse(metadata);
				const publisherBlog = metadataJson.blogs.find(blog => blog.type === 'PUBLISHER');
				expect(metadataJson.blogs.length).toEqual(blogRows.length);
				expect(metadataJson.blogs).toHaveLength(new Blogs(blogRows).length);
				expect(publisherBlog).not.toBeUndefined();
			})
			it('Publisher 블로그의 정보가 올바르다.', async () => {
				const blogRows = SpreadSheetMother.blogRows();
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: blogRows});

				await app.cloneOriginalPostsToGithub();

				const metadata = await githubRepository.readOrNull('metadata.json');
				const metadataJson: MetadataJson = JSON.parse(metadata);
				const metadataDomain = new Metadata(metadataJson);
				const publisherBlog = metadataJson.blogs.find(blog => blog.type === 'PUBLISHER')
				expect(publisherBlog.lastPublishedAt).toBe(DateUtil.nowFormatYYYYMMDD);
				expect(publisherBlog.lastPublishedIndex).toBe(metadataDomain.posts.last.index);
			})
			it('Github에 게시글을 업로드한다.', async () => {
				const blogRows = SpreadSheetMother.blogRows();
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: blogRows});

				await app.cloneOriginalPostsToGithub();

				const posts = await githubRepository.getFilesInDirectory('ko-KR');
				const rawMetadata = await githubRepository.readOrNull('metadata.json');
				const metadata = new Metadata(JSON.parse(rawMetadata));
				expect(posts.length).toBe(metadata.postLength);
			})
			it('Github 업로드된 게시글과 메타데이터가 정합하다.', async () => {
				const blogRows = SpreadSheetMother.blogRows();
				await spreadSheetRepository.write({range: 'Blogs!A2:F100', values: blogRows});

				await app.cloneOriginalPostsToGithub();

				const posts = await githubRepository.getFilesInDirectory('ko-KR');
				const rawMetadata = await githubRepository.readOrNull('metadata.json');
				const metadata = new Metadata(JSON.parse(rawMetadata));
				expect(posts.length).toBe(metadata.postLength);
			})
		})

		describe('케이스: 원본 글 복제만 수행됨', () => {

					it('메타데이터를 업데이트 한다.', async () => {
				const previousMetadata = await uploadMetadataWithPosts();

				await app.cloneOriginalPostsToGithub();

				const metadataString = await githubFactory.readOrNull('metadata.json');
				expect(previousMetadata.toString).not.toBe(metadataString);
			})

			it('메타데이터의 마지막 실행일이 오늘 날짜이다.', async () => {
				await uploadMetadataWithPosts();

				await app.cloneOriginalPostsToGithub();

				const metadataString = await githubFactory.readOrNull('metadata.json');
				const metadata = JSON.parse(metadataString) as MetadataJson;
				expect(metadata.lastExecutedAt).toBe(DateUtil.nowFormatYYYYMMDD);
			})

			it('메타데이터에 신규 게시글이 반영된다.', async () => {
				const previousMetadata = await uploadMetadataWithPosts();

				await app.cloneOriginalPostsToGithub();

				const [posts, _] = await rssReader.readBlogsAndPosts();
				const previousPostCount = Object.keys(previousMetadata.posts).length;
				expect(previousPostCount).toBe(previousPostCount+posts.length);
			})

			it('Subscriber 블로그는 Publisher 블로그보다 발행글 index가 이전이거나 같다.', async () => {
				await uploadMetadataWithPosts();
				await app.cloneOriginalPostsToGithub();
				const metadataString = await githubFactory.readOrNull('metadata.json');
				const metadata = JSON.parse(metadataString) as MetadataJson;

				let mostIndex = 0;
				metadata.blogs.forEach(blog => {
					if (blog.type === 'PUBLISHER') {
						expect(blog.lastPublishedIndex).toBeGreaterThanOrEqual(mostIndex);
					} else if (blog.type === 'SUBSCRIBER') {
						expect(blog.lastPublishedIndex).toBeLessThanOrEqual(mostIndex);
					}

					if (blog.lastPublishedIndex > mostIndex) {
						mostIndex = blog.lastPublishedIndex;
					}
				})
			})

			it('새로운 게시글은 마지막 발행글의 index보다 크다.', async () => {
				const previousMetadata = await uploadMetadataWithPosts();

				await app.cloneOriginalPostsToGithub();

				const metadataString = await githubFactory.readOrNull('metadata.json');
				const metadata = new Metadata(JSON.parse(metadataString));
				const newPostIndexes = metadata.posts.indexes.filter(index => !previousMetadata.posts.hasPostIndex(index));

				expect(newPostIndexes.length).toBeGreaterThan(0);
				newPostIndexes.forEach(index => {
					expect(Number(index)).toBeGreaterThanOrEqual(previousMetadata.publishBlog.lastPublishedIndex)
					expect(Number(index)).toBeLessThanOrEqual(metadata.publishBlog.lastPublishedIndex)
				});
			})

			it('새로운 게시글은 Github에 업로드된다.', async () => {
				await uploadMetadataWithPosts();

				await app.cloneOriginalPostsToGithub();

				const metadataString = await githubFactory.readOrNull('metadata.json');
				const metadata = new Metadata(JSON.parse(metadataString));
				const posts = await githubFactory.getFilesInDirectory('ko-KR');
				expect(posts.length).toBe(metadata.postLength);
			})

			it('새로운 게시글은 Github에 업로드된 게시글과 메타데이터가 정합하다.', async () => {
				await uploadMetadataWithPosts();

				await app.cloneOriginalPostsToGithub();

				const metadataString = await githubFactory.readOrNull('metadata.json');
				const metadata = new Metadata(JSON.parse(metadataString));
				const posts = await githubFactory.getFilesInDirectory('ko-KR');
				const postFileNames: string[] = posts.map(post => post.name);
				postFileNames.forEach(fileName => {
					const index = fileName.split('.')[0];
					expect(index).not.toBe('null');
					expect(index).not.toBeNaN();
					expect(metadata.posts.hasPostIndex(Number(index))).toBeTruthy();
				})
				expect(posts.length).toBe(metadata.postLength);
			})

			it('이미 업로드되어 있는 글은 다시 업로드하지 않는다.', async () => {
				await app.cloneOriginalPostsToGithub();
				expect(() => app.cloneOriginalPostsToGithub()).resolves.toThrow();
			})
		})
	})

	// TODO: Translator Stub 객체 활용하여 e2e 테스트 구현
	describe('구독 블로그에 번역글을 업로드한다.', () => {
		it('번역글이 없으면 Github에 업로드하지 않는다.', async () => {
			// await githubFactory.deleteFile('metadata.json');
			// await githubFactory.deleteDirectory('ko-KR');
			// await uploadMetadataWithPosts();
			// await app.cloneOriginalPostsToGithub();
			await app.uploadPosts();
		})
		it.todo('구독 블로그의 언어수만큼 번역글을 Github에 업로드한다.');
		it.todo('구독 블로그의 마지막 번역게시글을 갱신한다.')
		it.todo('구독 블로그의 마지막 번역게시글을 갱신한다.')
	})

	async function uploadMetadataWithPosts(): Promise<Metadata> {
		const metadataJsonString = MetadataMother.createMetadataBeforeAt(DateUtil.min);
		const metadata = new Metadata(JSON.parse(metadataJsonString));

		const rows =  SpreadSheetMother.blogRowsByMetadata(metadata)
		await spreadSheetFactory.write({range: 'Blogs!A2:F100', values: rows});
		const files = [...metadata.posts.toGithubUploadFiles.map(file=>{file.content='test'; return file}),{content: metadataJsonString, path: 'metadata.json'}]
		await githubFactory.upload(files);

		return metadata
	}
});
