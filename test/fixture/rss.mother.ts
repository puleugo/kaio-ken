import { faker } from "@faker-js/faker";
import type { RssPostDto } from "@src/module/dto/rss-post.dto";
import type { RssResponseDto } from "@src/module/dto/rss-response.dto";
import { XMLBuilder } from "fast-xml-parser";

export namespace RssMother {
	export function createPost(props?: Partial<RssPostDto>): RssPostDto {
		return {
			title: props?.title ?? faker.lorem.sentence(),
			link: props?.link ?? faker.internet.url(),
			description: props?.description ?? faker.lorem.paragraph(),
			guid: props?.guid ?? faker.internet.url(),
			pubDate: props?.pubDate ?? faker.date.recent(),
			author: props?.author ?? faker.person.fullName(),
			category: props?.category ?? faker.lorem.word(),
		};
	}

	export function createPosts(count = 1): RssPostDto[] {
		return Array.from({ length: count }, () => createPost());
	}

	export function createResponse(props?: Partial<RssResponseDto>): RssResponseDto {
		const data = props?.rss;
		return {
			rss: {
				"@_version": data?.["@_version"] ?? "2.0",
				script: data?.script ?? [{ "@_src": "test" }],
				channel: {
					title: data?.channel?.title ?? [faker.lorem.words(3)],
					link: data?.channel?.link ?? [faker.internet.url()],
					description: data?.channel?.description ?? [faker.lorem.words(10)],
					language: data?.channel?.language ?? ["en"],
					pubDate: data?.channel?.pubDate ?? [faker.date.recent().toISOString()],
					generator: data?.channel?.generator ?? ["WordPress"],
					ttl: data?.channel?.ttl ?? [100],
					managingEditor: data?.channel?.managingEditor ?? [faker.person.fullName()],
					image: data?.channel?.image ?? [
						{
							title: [faker.lorem.words(3)],
							url: [faker.image.url()],
							link: [faker.internet.url()],
						},
					],
					item:
						data?.channel?.item ??
						createPosts(5).map((post) => ({
							title: post.title,
							link: post.link,
							description: post.description,
							"content:encoded": post.description,
							category: post.category ?? "",
							author: post.author ?? "",
							guid: post.guid,
							comments: faker.internet.url(),
							pubDate: post.pubDate.toISOString(),
						})),
				},
			},
		};
	}

	export function createResponseXml(props?: Partial<RssResponseDto>): string {
		return new XMLBuilder({ format: true, ignoreAttributes: false }).build(RssMother.createResponse(props));
	}
}
