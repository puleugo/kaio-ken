import { faker } from "@faker-js/faker";
import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { PostUrl } from "@src/module/domain/post-url";
import { PostEntity } from "@src/module/domain/post.entity";
import { Posts } from "@src/module/domain/posts";
import type { RssPostDto } from "@src/module/dto/rss-post.dto";

describe("Posts", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
	});

	const createPost = (url: string) => {
		return PostEntity.create({
			title: PostTitle.from("Test Post").getValue(),
			content: PostContent.from("Test Content").getValue(),
			uploadedAt: PostUploadedDate.from(new Date()).getValue(),
			url: PostUrl.from(url).getValue(),
			language: Language.from("en").getValue(),
		}).getValue();
	};

	const createRssPost = (url: string): RssPostDto => ({
		title: "Test Post",
		link: url,
		description: "Test Description",
		guid: url,
		pubDate: new Date(),
	});

	it("should create empty posts collection", () => {
		const posts = Posts.create([]);
		expect(posts.isEmpty).toBe(true);
		expect(posts.length).toBe(0);
		expect(posts.getAll()).toHaveLength(0);
	});

	it("should create posts collection with initial values", () => {
		const post1 = createPost("https://example.com/post1");
		const post2 = createPost("https://example.com/post2");
		const posts = Posts.create([post1, post2]);

		expect(posts.isEmpty).toBe(false);
		expect(posts.length).toBe(2);
		expect(posts.getAll()).toHaveLength(2);
		expect(posts.getAll()).toContain(post1);
		expect(posts.getAll()).toContain(post2);
	});

	it("should filter unuploaded posts", () => {
		const post1 = createPost("https://example.com/post1");
		const posts = Posts.create([post1]);

		const rssPosts: RssPostDto[] = [
			createRssPost("https://example.com/post1"),
			createRssPost("https://example.com/post2"),
			createRssPost("https://example.com/post3"),
		];

		const unuploaded = posts.filterUnUploaded(rssPosts);
		expect(unuploaded).toHaveLength(2);
		expect(unuploaded).toContainEqual(rssPosts[1]);
		expect(unuploaded).toContainEqual(rssPosts[2]);
	});

	it("should filter unuploaded posts using link when guid is not available", () => {
		const post1 = createPost("https://example.com/post1");
		const posts = Posts.create([post1]);

		const rssPosts: RssPostDto[] = [
			{ ...createRssPost("https://example.com/post1"), guid: faker.internet.url() },
			{ ...createRssPost("https://example.com/post2"), guid: "" },
		];

		const unuploaded = posts.filterUnUploaded(rssPosts);
		expect(unuploaded).toHaveLength(1);
		expect(unuploaded).not.toContainEqual(rssPosts[1]);
	});

	it("should return a new array when getting all posts", () => {
		const post1 = createPost("https://example.com/post1");
		const post2 = createPost("https://example.com/post2");
		const posts = Posts.create([post1, post2]);

		const allPosts = posts.getAll();
		expect(allPosts).not.toBe(posts.getAll());
		expect(allPosts).toEqual([post1, post2]);
	});

	it("should handle empty rss posts array", () => {
		const post1 = createPost("https://example.com/post1");
		const posts = Posts.create([post1]);

		const unuploaded = posts.filterUnUploaded([]);
		expect(unuploaded).toHaveLength(0);
	});
});
