import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { MetadataYamlParser } from "@src/module/parser/metadata-yaml.parser";

describe("MetadataYamlParser", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY);
	});

	describe("parse", () => {
		it("should parse valid metadata YAML", () => {
			const yaml = `
publisher:
  id: 1
  title: Publisher Blog
  url: https://publisher.com
  rssUrl: https://publisher.com/rss
  language: en
  platform: medium
  publishedId: 0
blogs:
  - id: 2
    title: Subscriber Blog
    url: https://subscriber.com
    language: en
    platform: medium
    publishedId: 0
    subscribe: true
  - id: 3
    title: UnSubscriber Blog
    url: https://subscriber2.com
    language: en
    platform: medium
    publishedId: 0
    subscribe: false`;

			const metadata = MetadataYamlParser.parse(yaml);
			expect(metadata.publisher).toBeInstanceOf(BlogEntity);
			expect(metadata.publisher.title.toString()).toBe("Publisher Blog");
			expect(metadata.publisher.url.toString()).toBe("https://publisher.com/");
			expect(metadata.publisher.rssUrl?.toString()).toBe("https://publisher.com/rss");
			expect(metadata.publisher.type.toString()).toBe("PUBLISHER");

			const blogs = metadata.subscriberBlogs.getAll();
			expect(blogs).toHaveLength(2);

			const subscriber = blogs[0];
			expect(subscriber.title.toString()).toBe("Subscriber Blog");
			expect(subscriber.url.toString()).toBe("https://subscriber.com/");
			expect(subscriber.type.toString()).toBe("SUBSCRIBER");

			const anotherPublisher = blogs[1];
			expect(anotherPublisher.title.toString()).toBe("UnSubscriber Blog");
			expect(anotherPublisher.url.toString()).toBe("https://subscriber2.com/");
			expect(anotherPublisher.type.toString()).toBe("UNSUBSCRIBER");
		});

		it("should throw error for publisher in blogs field", () => {
			const invalidYaml = `
publisher:
  id: 1
  title: Publisher Blog
  url: https://publisher.com
  rssUrl: https://publisher.com/rss
  language: en
  platform: medium
  publishedId: 0
blogs:
  - id: 2
    title: Subscriber Blog 1
    url: https://subscriber.com
    language: en
    platform: medium
    publishedId: 0
    subscribe: true
  - id: 3
    title: Invalid Blog
    url: https://publisher.com
    language: en
    platform: medium
    rssUrl: https://publisher.com/rss
    publishedId: 0
    subscribe: false`;
		});

		it("should throw error for invalid YAML format", () => {
			const invalidYaml = "invalid: yaml: format:";
			expect(() => MetadataYamlParser.parse(invalidYaml)).toThrow();
		});

		it("should throw error for missing required fields", () => {
			const incompleteYaml = `
publisher:
  id: 1
  title: Publisher Blog
  url: https://publisher.com
  language: en
  platform: medium
  publishedId: 0`;

			expect(() => MetadataYamlParser.parse(incompleteYaml)).toThrow();
		});

		it("should throw error for publisher without RSS URL", () => {
			const invalidYaml = `
publisher:
  id: 1
  title: Publisher Blog
  url: https://publisher.com
  language: en
  platform: medium
  publishedId: 0
blogs: []`;

			expect(() => MetadataYamlParser.parse(invalidYaml)).toThrow();
		});
	});

	describe("parseToYaml", () => {
		it("should convert object to YAML string", () => {
			const obj = {
				publisher: {
					id: 1,
					title: "Test Blog",
					url: "https://example.com",
					rssUrl: "https://example.com/rss",
					language: "en",
					platform: "medium",
					publishedId: 0,
				},
				blogs: [],
			};

			const yaml = MetadataYamlParser.parseToYaml(obj);
			expect(yaml).toContain("publisher:");
			expect(yaml).toContain("title: Test Blog");
			expect(yaml).toContain("url: https://example.com");
			expect(yaml).toContain("rssUrl: https://example.com/rss");
			expect(yaml).toContain("language: en");
			expect(yaml).toContain("platform: medium");
			expect(yaml).toContain("blogs: []");
		});
	});
});
