import type { UniqueEntityId } from "../../core/unique-identifier";
import type { BlogEntity } from "../domain/blog.entity";
import type { Posts } from "../domain/posts";

export interface RssSearcher {
	searchUnuploadedPosts(publisher: BlogEntity): Promise<Posts>;
	readBlog(blogId: UniqueEntityId): Promise<BlogEntity>;
}
