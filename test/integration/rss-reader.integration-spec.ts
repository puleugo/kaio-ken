import {RssReader, OriginalContentReaderInterface} from "../../src/implemention/rss.reader";
import {RssRepositoryStub} from "../stub/rss-repository.stub";
import {SpreadSheetRepositoryStub} from "../stub/spread-sheet-repository.stub";
import {PostMother} from "../fixture/PostMother";
import {BlogMother} from "../fixture/blog.mother";
import {Blogs} from "../../src/domain/blogs";
import {Posts} from "../../src/domain/posts";

describe('RssReader Integration Test', () => {
	let rssReader: OriginalContentReaderInterface;
	let rssRepositoryStub: RssRepositoryStub;
	let spreadSheetRepositoryStub: SpreadSheetRepositoryStub

	beforeAll(() => {
		rssRepositoryStub = new RssRepositoryStub();
		spreadSheetRepositoryStub = new SpreadSheetRepositoryStub();
		rssReader = new RssReader(rssRepositoryStub, spreadSheetRepositoryStub);
	})

	afterEach(() => {
		rssRepositoryStub.reset();
		spreadSheetRepositoryStub.reset();
	})

	it('마지막 배포 게시글 이후의 게시글을 가져온다.', async () => {
		spreadSheetRepositoryStub.blogs = new Blogs([BlogMother.create({lastPublishedIndex: 3, type: 'PUBLISHER'})])
		rssRepositoryStub.posts = new Posts(PostMother.createMany(5, 1));
		const [posts, _] = await rssReader.readBlogsAndPosts();
		expect(posts).toHaveLength(2)
	})

	it('게시글을 응답한다.', async () => {
		rssRepositoryStub.posts = new Posts(PostMother.createMany(3));
		spreadSheetRepositoryStub.blogs = new Blogs([BlogMother.create({type: 'PUBLISHER', lastPublishedIndex: 0})]);
		const [posts, _] = await rssReader.readBlogsAndPosts()
		expect(posts).toBeDefined();
		expect(posts.length).toBe(3);
	})
	it('RSS를 통해 게시글을 읽는다.', async () => {
		rssRepositoryStub.posts = new Posts(PostMother.createMany(3));
		spreadSheetRepositoryStub.blogs = new Blogs(BlogMother.createMany(3));
		await rssReader.readBlogsAndPosts()
		expect(rssRepositoryStub.hasRead).toBeTruthy()
	});
	it('RSS를 통해 가져온 게시글은 index가 없다.', async () => {
		rssRepositoryStub.posts = new Posts(PostMother.createMany(3));
		spreadSheetRepositoryStub.blogs = new Blogs(BlogMother.createMany(3));
		const [posts, _] = await rssReader.readBlogsAndPosts()
		posts.toEntities.forEach(
			post => expect(post.index).toBeNull()
		)
	})

	it('블로그를 응답한다.', async () => {
		spreadSheetRepositoryStub.blogs = new Blogs(BlogMother.createMany(3));
		const [_, blogs] = await rssReader.readBlogsAndPosts();
		expect(blogs).toBeDefined();
		expect(blogs).toHaveLength(3);
	})
	it('Publusher 블로그가 복수개라면 에러를 반환한다.', () => {
		spreadSheetRepositoryStub.blogs = new Blogs(BlogMother.createMany(3));
		expect(rssReader.readBlogsAndPosts()).rejects.toThrow();
	})
	it('Unsubsriber 블로그는 가져오지 않는다.', async () => {
		spreadSheetRepositoryStub.blogs = new Blogs([...BlogMother.createMany(3), BlogMother.create({type: 'UNSUBSCRIBER'})]);
		const [_, blogs] = await rssReader.readBlogsAndPosts();
		expect(blogs).toHaveLength(3);
	})
})
