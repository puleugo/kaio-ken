import {PostUploader} from "../../src/implemention/post.uploader";
import {envManager} from "../../src/util/config/env-manager";
import {BlogPlatformEnum, HrefTagEnum} from "../../src/type";
import {Metadata} from "../../src/domain/metadata";
import {PostMother} from "../fixture/PostMother";
import {BlogMother} from "../fixture/blog.mother";
import {Blogs} from "../../src/domain/blogs";
import {Posts} from "../../src/domain/posts";
import {TistoryStrategy} from "../../src/implemention/strategy/tistory.strategy";
import {MediumStrategy} from "../../src/implemention/strategy/medium.strategy";
import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {GithubReaderStub} from "../stub/github-reader.stub";

describe('PostUploader Integration Test', () => {
	jest.setTimeout(1000 * 60 * 10);
	let postUploader: PostUploader;
	let githubReaderStub: GithubReaderStub;

	beforeAll(() => {
		envManager.loadDotEnv();
		githubReaderStub = new GithubReaderStub();
		postUploader = new PostUploader(githubReaderStub,console);
	})

	describe('MediumStrategy', () => {
		beforeAll(() => {
			postUploader.registerStrategy(BlogPlatformEnum.Medium, new MediumStrategy(envManager));
		})

		it('게시글을 업로드 한다.', async () => {
			const strategy = new MediumStrategy(envManager);
			const postsEntities = [PostMother.create({language: HrefTagEnum.English, originUrl: 'https://exmample.com'})];
			const posts = new TranslatedPosts(postsEntities)

			const result = await strategy.uploadPosts(posts)
			result.map(post => {
				expect(post.originUrl).toContain('https://medium.com/');
			})
		});

		it('게시글을 업데이트 한다.', async () => {
			const mediumBlog = BlogMother.create({language: HrefTagEnum.English,platform: BlogPlatformEnum.Medium, type: 'SUBSCRIBER'})
			const posts = [PostMother.create({title: 'TEST',language: HrefTagEnum.English ,originUrl: 'https://exmample.com'})]
			githubReaderStub.metadata = new Metadata({
				posts: new Posts(posts),
				blogs: new Blogs([mediumBlog]),
			})
			const result = await postUploader.upload(new TranslatedPosts(posts));
			result.map(post => {
				expect(post.originUrl).toContain('https://medium.com/');
			})
		})

		it('metadata로부터 hreflang을 생성한다.', async () => {
			const metadata = new Metadata({posts: new Posts(PostMother.createManyWithTranslatedPosts(3)).metadata, blogs: new Blogs(BlogMother.createMany(3)).metadata, lastExecutedAt: '2021-01-01'});

			await postUploader.uploadHreflang(metadata);
		})
	})

	describe('TistoryStrategy', () => {
		beforeAll(() => {
			postUploader.registerStrategy(BlogPlatformEnum.Medium, new MediumStrategy(envManager));
		})

		it('게시글을 업로드 한다.', async () => {
			// const posts = new Posts(PostMother.createMany(3).map(post => {post.content = 'test'; return post}));
			// const uploadedPosts = await postUploader.upload(posts);
			// expect(uploadedPosts).not.toBeNull();
		});

		it('게시글을 업데이트 한다.', async () => {
			const strategy = new TistoryStrategy(envManager);
			const posts = new Posts([PostMother.create({originUrl: 'https://puleugo.tistory.com/209'})])
			posts.blog = BlogMother.create({platform: BlogPlatformEnum.Tistory, rssUrl: 'https://puleugo.tistory.com/rss'});
			await strategy.updatePosts(posts);
		})
	})
})
