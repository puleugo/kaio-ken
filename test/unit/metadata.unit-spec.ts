import {Metadata} from "../../src/domain/metadata";
import {MetadataMother} from "../fixture/metadata.mother";
import {Posts, PostsMetadata} from "../../src/domain/posts";
import {HrefTagEnum} from "../../src/type";
import {PostMother} from "../fixture/PostMother";
import {BlogMother} from "../fixture/blog.mother";
import {Blogs} from "../../src/domain/blogs";
import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {PostMetadata} from "../../src/domain/postEntity";
import {DateUtil} from "../../src/util/util/DateUtil";

describe('Metadata Unit Test', () => {
	const lastExecutedAt = DateUtil.minFormatYYYYMMDD;
	it('객체를 생성한다.', () => {
		const posts = MetadataMother.createPosts();
		const blogs = MetadataMother.createBlogs();

		const metadata = new Metadata({posts, blogs, lastExecutedAt})

		expect(metadata).not.toBeNull();
	})
	it('언어 별 번역본 수는 하나를 초과할 수 없다.', async () => {
		const enPosts = new TranslatedPosts([PostMother.create({language: HrefTagEnum.English}), PostMother.create({language: HrefTagEnum.English})]);
		const posts = new Posts([PostMother.create({
			language: HrefTagEnum.Korean,
			translatedPosts: enPosts
		})]);
		const blogs = new Blogs([BlogMother.create()]);
		expect(() => new Metadata({posts, blogs})).toThrow();
	})

	it('동일한 URL을 가진 게시글은 추가되지 않는다.', async () => {
		const posts = new Posts([PostMother.create({originUrl: 'https://example.com'})]);
		const blogs = new Blogs([BlogMother.create({type: 'PUBLISHER'})]);
		const metadata = new Metadata({posts, blogs, lastExecutedAt});

		const newPosts = new Posts([PostMother.create({originUrl: 'https://example.com'})]);
		metadata.update(newPosts, blogs)

		expect(metadata.posts).toHaveLength(1);
	})
	it('번역본을 수정한다.', async () => {
		const enPosts = new TranslatedPosts([PostMother.create({language: HrefTagEnum.English})]);
		const posts = new Posts([PostMother.create({
			language: HrefTagEnum.Korean,
			translatedPosts: enPosts
		})]);
		const blogs = new Blogs([BlogMother.create()]);
		expect(() => new Metadata({posts, blogs})).toThrow();
	})
	it('Publisher 블로그는 반드시 하나가 존재하는 상태로 생성된다.', () => {
		const posts = MetadataMother.createPosts();
		const blogs = MetadataMother.createBlogsWithoutPublisher();

		expect(() =>new Metadata({posts, blogs, lastExecutedAt})).toThrow()
	})
	it('게시글 목록이 반환된다.', () => {
		const postCount = 3;
		const posts = MetadataMother.createPosts(postCount);
		const blogs = MetadataMother.createBlogs();

		const metadata = new Metadata({posts, blogs, lastExecutedAt})
		expect(JSON.parse(metadata.json)['posts']).toEqual(posts);
		expect(Object.keys(JSON.parse(metadata.json)['posts']).length).toEqual(postCount);
	})
	it('번역된 게시글 목록이 반환된다.', () => {
		const postCount = 3;
		const translatedPostCount = 2;
		const posts = MetadataMother.createPosts(postCount, translatedPostCount);
		const blogs = MetadataMother.createBlogs();

		const postsJson = JSON.parse(new Metadata({posts, blogs,lastExecutedAt}).json).posts;

		Object.values(postsJson as PostsMetadata).forEach((post) => {
			const { translatedLanguages, translated } = post;

			expect(translatedLanguages).toHaveLength(translatedPostCount);

			translatedLanguages.forEach((language: HrefTagEnum) => {
				expect(translated[language]).toBeDefined();
			});
		});
	})

	it('블로그 목록이 반환된다.', () => {
		const posts = MetadataMother.createPosts();
		const blogs = MetadataMother.createBlogs();

		const metadata = new Metadata({posts, blogs,lastExecutedAt: lastExecutedAt})
		expect(JSON.parse(metadata.json)['blogs']).toEqual(blogs);
	})

	it('갱신된다.', () => {
		const metadata = new Metadata({posts:  MetadataMother.createPosts(3), blogs: MetadataMother.createBlogs(),lastExecutedAt})
		const metadataJson = metadata.json;

		metadata.update(new Posts(PostMother.createMany(3)), new Blogs(BlogMother.createMany(3)));
		const updatedMetadataJson = metadata.json;

		expect(metadataJson).not.toEqual(updatedMetadataJson);
	});

	it('신규 게시글을 추가한다.',()=>{
		const raw = PostMother.createMany(10, {index: 0});
		const posts = new Posts(raw.slice(0, 5));
		const newPost = new Posts(raw.slice(5, 10));
		const metadata = new Metadata({posts: posts.metadata, blogs: MetadataMother.createBlogs(), lastExecutedAt})

		metadata.update(newPost, new Blogs(BlogMother.createMany(3)));

		const updatedPosts = Object.values(JSON.parse(metadata.json).posts);
		expect(updatedPosts).toHaveLength(posts.length + newPost.length);
	})
	it('이미 존재하는 게시글은 무시한다.',()=>{
		const raw = PostMother.createMany(10, {index: 0});
		const posts = new Posts(raw.slice(0, 5));
		const newPost = new Posts(raw.slice(0, 10));
		const metadata = new Metadata({posts: posts.metadata, blogs: MetadataMother.createBlogs(),lastExecutedAt})

		metadata.update(newPost, new Blogs(BlogMother.createMany(3)));

		const updatedPosts = Object.values(JSON.parse(metadata.json).posts);
		expect(updatedPosts).toHaveLength(raw.length);
	})
	it('기존 게시글의 번역글이 추가된다.', () => {
		const posts = PostMother.createMany(5, {index: 0});
		const blogs = new Blogs(BlogMother.createMany(3));
		const metadata = new Metadata({posts: new Posts(posts).metadata, blogs: blogs.metadata, lastExecutedAt})
		const postsWithTranslated = new Posts(posts.map(post => {
			post.translatedPosts = new TranslatedPosts(PostMother.createMany(3));
			return post
		}));
		metadata.update(postsWithTranslated, blogs);

		const updatedPosts: PostMetadata[] = Object.values(JSON.parse(metadata.json).posts);
		updatedPosts.forEach((post) => {
			expect(post.translatedLanguages).toHaveLength(3);
		})
	})
	it('블로그 정보를 갱신한다.',()=>{
		const posts = MetadataMother.createPosts();
		const blogs = MetadataMother.createBlogs();
		const newPosts = new Posts(PostMother.createMany());
		const newBlogs = new Blogs(BlogMother.createMany());

		const metadata = new Metadata({posts, blogs,lastExecutedAt})

		metadata.update(newPosts, newBlogs);

		expect(JSON.parse(metadata.json).blogs).toEqual(newBlogs.metadata);
	})
	it('Publisher가 존재하지 않는 상태로는 갱신하지 않는다.',()=>{
		const posts = MetadataMother.createPosts();
		const blogs = MetadataMother.createBlogs();
		const newPosts = new Posts(PostMother.createMany());
		const newBlogs = new Blogs(BlogMother.createManyWithoutPublisher());

		const metadata = new Metadata({posts, blogs, lastExecutedAt})

		expect(() => metadata.update(newPosts, newBlogs)).toThrow()
	})
})
