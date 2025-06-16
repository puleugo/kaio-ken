import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogTitle } from "@src/module/domain/blog-title";
import { BlogType } from "@src/module/domain/blog-type";
import { BlogUrl } from "@src/module/domain/blog-url";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";

describe("BlogEntity", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
	});

	const createBlogProps = () => ({
		title: BlogTitle.create("Test Blog").getValue(),
		language: Language.from("en").getValue(),
		platform: BlogPlatform.from("medium").getValue(),
		type: BlogType.PUBLISHER,
		url: BlogUrl.from("https://example.com/blog").getValue(),
		rssUrl: BlogUrl.from("https://example.com/blog/rss").getValue(),
	});

	it("should create a blog with required properties", () => {
		const props = createBlogProps();
		const result = BlogEntity.create(props);

		expect(result.isSucceed).toBe(true);
		const blog = result.getValue();
		expect(blog.title).toBe(props.title);
		expect(blog.language).toBe(props.language);
		expect(blog.platform).toBe(props.platform);
		expect(blog.type).toBe(props.type);
		expect(blog.url).toBe(props.url);
		expect(blog.rssUrl).toBe(props.rssUrl);
		expect(blog.lastPublishedId).toBeInstanceOf(UniqueEntityId);
		expect(blog.lastPublishedId.toString()).toBe("0");
	});

	it("should create a blog with a specific id", () => {
		const props = createBlogProps();
		const id = UniqueEntityId.create(1);
		const result = BlogEntity.create(props, id);

		expect(result.isSucceed).toBe(true);
		const blog = result.getValue();
		expect(blog.id).toBe(id);
	});

	it("should create a blog with a specific lastPublishedId", () => {
		const props = createBlogProps();
		const lastPublishedId = UniqueEntityId.create(100);
		const result = BlogEntity.create({ ...props, lastPublishedId });

		expect(result.isSucceed).toBe(true);
		const blog = result.getValue();
		expect(blog.lastPublishedId).toBe(lastPublishedId);
	});

	it("should fail when required properties are missing", () => {
		const props = createBlogProps();
		const result = BlogEntity.create({ ...props, title: undefined as unknown as BlogTitle });

		expect(result.isFailed).toBe(true);
		expect(result.getReason()).toContain("title");
	});

	it("should fail when rssUrl is missing for publisher type", () => {
		const props = createBlogProps();
		const result = BlogEntity.create({ ...props, rssUrl: undefined });

		expect(result.isFailed).toBe(true);
		expect(result.getReason()).toContain("rssUrl");
	});

	it("should allow rssUrl to be undefined for non-publisher type", () => {
		const props = createBlogProps();
		const result = BlogEntity.create({
			...props,
			type: BlogType.SUBSCRIBER,
			rssUrl: undefined,
		});

		expect(result.isSucceed).toBe(true);
		const blog = result.getValue();
		expect(blog.rssUrl).toBeUndefined();
	});

	it("should update lastPublishedId", () => {
		const props = createBlogProps();
		const result = BlogEntity.create(props);
		const blog = result.getValue();
		const newId = UniqueEntityId.create(200);

		blog.lastPublishedId = newId;
		expect(blog.lastPublishedId).toBe(newId);
	});

	it("should have correct entity key", () => {
		expect(BlogEntity.ENTITY_KEY).toBe("BlogEntity");
	});

	it("should create a blog with auto-increment id when not specified", () => {
		const props = createBlogProps();
		const result = BlogEntity.create(props);

		expect(result.isSucceed).toBe(true);
		const blog = result.getValue();
		expect(blog.id).toBeInstanceOf(UniqueEntityId);
	});
});
