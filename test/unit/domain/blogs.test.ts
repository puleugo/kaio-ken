import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogTitle } from "@src/module/domain/blog-title";
import { BlogType } from "@src/module/domain/blog-type";
import { BlogUrl } from "@src/module/domain/blog-url";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Blogs } from "@src/module/domain/blogs";
import { Language } from "@src/module/domain/language";

describe("Blogs", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
	});

	const createBlog = (type: BlogType, rssUrl?: string) => {
		return BlogEntity.create({
			title: BlogTitle.create("Test Blog").getValue(),
			language: Language.from("en").getValue(),
			platform: BlogPlatform.from("medium").getValue(),
			type,
			url: BlogUrl.from("https://example.com/blog").getValue(),
			rssUrl: rssUrl ? BlogUrl.from(rssUrl).getValue() : undefined,
		}).getValue();
	};

	it("should create blogs collection", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const result = Blogs.of([publisher]);

		expect(result.isSucceed).toBe(true);
		const blogs = result.getValue();
		expect(blogs.getAll()).toHaveLength(1);
		expect(blogs.getAll()).toContain(publisher);
	});

	it("should get publisher blog", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const blogs = Blogs.of([publisher]).getValue();

		expect(blogs.getPublisher()).toBe(publisher);
	});

	it("should throw error when publisher blog not found", () => {
		const subscriber = createBlog(BlogType.SUBSCRIBER);
		const blogs = Blogs.of([subscriber]).getValue();

		expect(() => blogs.getPublisher()).toThrow("Publisher blog not found");
	});

	it("should get subscriber blogs", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const subscriber1 = createBlog(BlogType.SUBSCRIBER);
		const subscriber2 = createBlog(BlogType.SUBSCRIBER);
		const blogs = Blogs.of([publisher, subscriber1, subscriber2]).getValue();

		const subscribers = blogs.getSubscribers();
		expect(subscribers).toHaveLength(2);
		expect(subscribers).toContain(subscriber1);
		expect(subscribers).toContain(subscriber2);
	});

	it("should get unsubscriber blogs", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const unsubscriber1 = createBlog(BlogType.UNSUBSCRIBER);
		const unsubscriber2 = createBlog(BlogType.UNSUBSCRIBER);
		const blogs = Blogs.of([publisher, unsubscriber1, unsubscriber2]).getValue();

		const unsubscribers = blogs.getUnsubscribers();
		expect(unsubscribers).toHaveLength(2);
		expect(unsubscribers).toContain(unsubscriber1);
		expect(unsubscribers).toContain(unsubscriber2);
	});

	it("should check if blog exists", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const blogs = Blogs.of([publisher]).getValue();

		expect(blogs.existBlog(publisher)).toBe(true);
		expect(blogs.existBlog(createBlog(BlogType.PUBLISHER, "https://example.com/other/rss"))).toBe(false);
	});

	it("should add new blog", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const blogs = Blogs.of([publisher]).getValue();
		const newBlog = createBlog(BlogType.SUBSCRIBER);

		const result = blogs.put(newBlog);
		expect(result.isSucceed).toBe(true);
		const updatedBlogs = result.getValue();
		expect(updatedBlogs.getAll()).toHaveLength(2);
		expect(updatedBlogs.getAll()).toContain(publisher);
		expect(updatedBlogs.getAll()).toContain(newBlog);
	});

	it("should fail to add duplicate blog", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const blogs = Blogs.of([publisher]).getValue();

		const result = blogs.put(publisher);
		expect(result.isFailed).toBe(true);
		expect(result.getReason()).toBe("Blog already exists");
	});

	it("should return a new array when getting all blogs", () => {
		const publisher = createBlog(BlogType.PUBLISHER, "https://example.com/blog/rss");
		const blogs = Blogs.of([publisher]).getValue();

		const allBlogs = blogs.getAll();
		expect(allBlogs).not.toBe(blogs.getAll());
		expect(allBlogs).toEqual([publisher]);
	});
});
