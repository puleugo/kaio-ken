import type { BlogEntity } from "../domain/blog.entity";
import type { RssPostDto } from "../dto/rss-post.dto";

export interface RssClient {
	// RSS를 통해 게시글을 조회합니다. 조회한 게시글의 ID는 존재하지 않습니다.
	readPosts(blog: BlogEntity): Promise<RssPostDto[]>;
}
