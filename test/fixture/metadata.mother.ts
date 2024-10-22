import {Posts, PostsMetadata} from "../../src/domain/posts";
import {Blogs, BlogsMetadata} from "../../src/domain/blogs";
import {BlogMother} from "./blog.mother";
import {PostMother} from "./PostMother";

export class MetadataMother {
	static createPosts(count?: number, translatedCount?: number): PostsMetadata {
		return new Posts(PostMother.createManyWithTranslatedPosts(count, translatedCount)).metadata;
	}

	static createBlogs(): BlogsMetadata {
		return new Blogs(BlogMother.createMany()).metadata
	}

	static createBlogsWithoutPublisher() {
		return new Blogs(BlogMother.createManyWithoutPublisher()).metadata
	}
}
