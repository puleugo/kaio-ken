import YAML from "yaml";
import { BlogType } from "../domain/blog-type";
import { Blogs } from "../domain/blogs";
import { Metadata } from "../domain/metadata";
import { BlogParser } from "./blog-parser";

export namespace MetadataYamlParser {
	export function parse(yaml: string): Metadata {
		const metadata = YAML.parse(yaml);

		const rawPublisher = metadata.publisher;
		const publisher = BlogParser.parse(
			{
				title: rawPublisher.title,
				url: rawPublisher.url,
				rssUrl: rawPublisher.rssUrl,
				language: rawPublisher.language,
				platform: rawPublisher.platform,
				lastPublishedId: rawPublisher.publishedId,
				type: BlogType.PUBLISHER,
			},
			rawPublisher.id,
		);

		const blogEntities = metadata.blogs.map((blog) =>
			BlogParser.parse(
				{
					title: blog.title,
					url: blog.url,
					language: blog.language,
					platform: blog.platform,
					lastPublishedId: blog.publishedId,
					type: blog.subscribe ? BlogType.SUBSCRIBER : BlogType.UNSUBSCRIBER,
				},
				blog.id,
			),
		);

		const blogs = Blogs.of(blogEntities);
		if (blogs.isFailed) {
			throw new Error(blogs.getReason());
		}

		const metadataResult = Metadata.from({
			publisher: publisher,
			blogs: blogs.getValue(),
		});
		if (metadataResult.isFailed) {
			throw new Error(metadataResult.getReason());
		}

		return metadataResult.getValue();
	}
	export function parseToYaml(metadata: object): string {
		return YAML.stringify(metadata);
	}
}
