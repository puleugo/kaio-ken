import type { UniqueEntityId } from "../../../core/unique-identifier";
import type { BlogEntity } from "../../domain/blog.entity";
import type { PostEntity } from "../../domain/post.entity";
import { Posts } from "../../domain/posts";
import { PostParser } from "../../parser/post-parser";
import type { RssClient } from "../../repository/rss.repository";
import type { FileReader } from "../file.reader";
import type { RssSearcher } from "../rss.searcher";

export class HttpRssSearcher implements RssSearcher {
	private cache: Map<UniqueEntityId, PostEntity[]> = new Map();

	constructor(
		private readonly rssRepository: RssClient,
		private readonly fileReader: FileReader,
	) {}

	async searchUnuploadedPosts(publisher: BlogEntity): Promise<Posts> {
		const cachedPosts: PostEntity[] | undefined = this.cache.get(publisher.id);
		if (cachedPosts) return Posts.create(cachedPosts);

		const postDtos = await this.rssRepository.readPosts(publisher);
		const postEntities = postDtos.map((dto) =>
			PostParser.parse({
				title: dto.title,
				uploadedAt: dto.pubDate,
				url: dto.guid,
				language: publisher.language.toString(),
				content: dto.description,
			}),
		);

		this.cache.set(publisher.id, postEntities);
		return Posts.create(postEntities);
	}

	async readBlog(id: UniqueEntityId): Promise<BlogEntity> {
		const metadata = await this.fileReader.getMetadata();
		return metadata.publisher;
	}
}
