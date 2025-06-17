import { Result } from "@src/core/result";
import type { BlogPublishedId } from "@src/module/domain/blog-published-id";
import { BlogType } from "@src/module/domain/blog-type";
import type { BlogEntity } from "@src/module/domain/blog.entity";

export class Blogs {
	private static readonly DUPLICATED_PUBLISHER_BLOG = "Publisher blog must be one";
	private static DUPLICATED_BLOG = "Blog already exists";
	private readonly blogs: ReadonlyArray<BlogEntity>;

	private constructor(value: Array<BlogEntity>) {
		this.blogs = value;
	}

	private static isPublisherBlogSingle(blogs: Array<BlogEntity>) {
		const publisherBlogs = blogs.filter((blog) => blog.type.equals(BlogType.PUBLISHER));
		return publisherBlogs.length === 1;
	}

	static of(value: Array<BlogEntity>): Result<Blogs> {
		return Result.success(new Blogs(value));
	}

	getPublisher(): BlogEntity {
		const publisher = this.blogs.find((blog) => blog.type.equals(BlogType.PUBLISHER)) || null;
		if (publisher === null) throw new Error("Publisher blog not found");

		return publisher;
	}

	getSubscribers(): Array<BlogEntity> {
		return this.blogs.filter((blog) => blog.type.equals(BlogType.SUBSCRIBER));
	}

	getUnsubscribers(): Array<BlogEntity> {
		return this.blogs.filter((blog) => blog.type.equals(BlogType.UNSUBSCRIBER));
	}

	existBlog(blog: BlogEntity): boolean {
		return this.blogs.some((b) => b.rssUrl === blog.rssUrl);
	}

	put(blog: BlogEntity): Result<Blogs> {
		if (this.existBlog(blog)) return Result.fail(Blogs.DUPLICATED_BLOG);
		return Blogs.of([...this.blogs, blog]);
	}

	putAll(blogs: Array<BlogEntity>): Result<Blogs> {
		const newBlogs = blogs.filter((blog) => !this.existBlog(blog));
		if (!Blogs.isPublisherBlogSingle([...blogs, ...newBlogs])) return Result.fail(Blogs.DUPLICATED_PUBLISHER_BLOG);
		return Blogs.of([...this.blogs, ...newBlogs]);
	}

	getAll(): Array<BlogEntity> {
		return [...this.blogs];
	}

	getLastBlogId(): number {
		if (this.blogs.length === 0) return 0;
		return Math.max(...this.blogs.map((blog) => blog.id.toNumber()));
	}

	updatePublishedId(id: BlogPublishedId, subscriberOnly = true): Blogs {
		const updatedBlogs = this.blogs.map((blog) => {
			if (subscriberOnly && !blog.type.equals(BlogType.SUBSCRIBER)) {
				return blog; // Only update subscriber blogs
			}
			blog.lastPublishedId = id;
			return blog;
		});

		return Blogs.of(updatedBlogs).getValue();
	}
}
