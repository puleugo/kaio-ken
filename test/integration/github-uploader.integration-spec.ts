import {GithubUploader, GithubUploaderInterface} from "../../src/implemention/github.uploader";
import {GithubRepositoryStub} from "../stub/github-repository.stub";
import {LoggerStub} from "../stub/logger.stub";
import {PostMother} from "../fixture/PostMother";
import {Posts} from "../../src/domain/posts";
import {Blogs} from "../../src/domain/blogs";
import {BlogMother} from "../fixture/blog.mother";
import {Metadata} from "../../src/domain/metadata";
import {envManager} from "../../src/util/config/env-manager";
import {spreadSheetUploader} from "../../src/implemention/spread-sheet.uploader";
import {spreadSheetReader} from "../../src/implemention/spread-sheet.reader";
import {GithubReaderStub} from "../stub/github-reader.stub";

describe('GithubUploader Integration Test', () => {
	let githubUploader: GithubUploaderInterface;
	let githubReaderStub: GithubReaderStub;
	let githubRepositoryStub: GithubRepositoryStub;
	let loggerStub: LoggerStub;

	beforeAll(() => {
		envManager.loadDotEnv();
		githubReaderStub = new GithubReaderStub()
		githubRepositoryStub = new GithubRepositoryStub();
		loggerStub = new LoggerStub()

		githubUploader = new GithubUploader(githubReaderStub, githubRepositoryStub, spreadSheetUploader,spreadSheetReader, loggerStub);
	})

	afterEach(() => {
		githubReaderStub.reset();
		githubRepositoryStub.reset();
		loggerStub.reset();
	})

	describe('게시글을 업로드 한다.', () => {
		it('게시글을 업로드 한다.', async () => {
			const posts = PostMother.createMany(3);
			const blogs = BlogMother.createMany(2);
			const metadata = await githubUploader.uploadPosts(new Posts(posts), new Blogs(blogs));

			expect(metadata.postLength).toBe(3);
			expect(metadata.blogLength).toBe(2);
		});

		it('Metadata가 없으면 새로 생성한다.', async () => {
			const posts = PostMother.createMany(3);
			const blogs = BlogMother.createMany(2);
			const metadata = await githubUploader.uploadPosts(new Posts(posts), new Blogs(blogs));

			expect(metadata.postLength).toBe(3);
			expect(metadata.blogLength).toBe(2);
		});

		it('Metadata가 있으면 업데이트한다.', async () => {
			const beforeMetadata = new Metadata({
				posts: new Posts(PostMother.createMany(3)),
				blogs: new Blogs(BlogMother.createMany(2))
			});
			githubRepositoryStub.metadata = beforeMetadata;

			const posts = PostMother.createMany(100);
			const blogs = BlogMother.createMany(100);
			const metadata = await githubUploader.uploadPosts(new Posts(posts), new Blogs(blogs));

			expect(metadata.postLength).not.toBe(3);
			expect(metadata.blogLength).not.toBe(2);
			expect(beforeMetadata.json).not.toStrictEqual(metadata.json);
		});

		it('Metadata가 존재하면 Metadata에 존재하지 않는 게시글을 추가한다.', () => {

		})
	});
})
