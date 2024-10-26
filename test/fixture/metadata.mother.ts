import {Posts, PostsMetadata} from "../../src/domain/posts";
import {Blogs, BlogsMetadata} from "../../src/domain/blogs";
import {BlogMother} from "./blog.mother";
import {PostMother} from "./PostMother";
import {Metadata, MetadataJson} from "../../src/domain/metadata";
import {DateUtil} from "../../src/util/util/DateUtil";
import dayjs from "dayjs";
import {GithubUploadFile} from "../../src/domain/github-upload-files";

export class MetadataMother {
	static createPosts(count?: number, translatedCount?: number): PostsMetadata {
		return new Posts(PostMother.createManyWithTranslatedPosts(count, translatedCount)).metadata;
	}

	static createBlogs(blogCount?: number): BlogsMetadata {
		return new Blogs(BlogMother.createManyWithRealPublisher(blogCount)).metadata
	}

	static createBlogsWithoutPublisher() {
		return new Blogs(BlogMother.createManyWithoutPublisher()).metadata
	}

	static createMetadata(postCount: number, blogCount: number): string {
		const json: MetadataJson = {
			lastExecutedAt: DateUtil.minFormatYYYYMMDD,
			posts: MetadataMother.createPosts(postCount),
			blogs: MetadataMother.createBlogs(blogCount)
		}
		return JSON.stringify(json, null, 2);
	}

	static createMetadataBeforeAt(date: Date): string {
		const json: MetadataJson = {
			lastExecutedAt: DateUtil.minFormatYYYYMMDD,
			posts: MetadataMother.createPosts(),
			blogs: MetadataMother.createBlogs()
		}
		return JSON.stringify(json, null, 2);
	}
}
