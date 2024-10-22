import {Posts} from "./posts";
import {Metadata} from "./metadata";
import {Blogs} from "./blogs";
import {DateUtil} from "../util/util/DateUtil";

export interface GithubUploadFile {
	path: string;
	content: string;
}

export class GithubUploadFileBuilder {
	private metadata: Metadata = null;
	private newPosts: Posts = null;
	private blogs: Blogs = null;

	addPosts(newPosts: Posts): GithubUploadFileBuilder {
		this.newPosts = newPosts;
		return this;
	}

	putBlogs(blogs: Blogs): GithubUploadFileBuilder {
		this.blogs = blogs;
		return this
	}

	putMetadata(previousMetadata: Metadata | null): GithubUploadFileBuilder {
		return this;
	}

	build(): GithubUploadFile[] {
		if (!this.metadata) {
			new Metadata({posts: this.newPosts.metadata, blogs: this.blogs.metadata, lastExecutedAt: DateUtil.nowFormatYYYYMMDD}).githubUploadFile;
			return new Posts([], this.blogs.publisherBlog).toGithubUploadFiles;
		}
		const lastExecutedAt = this.metadata.lastExecutedAt;
		const newPosts = this.newPosts.filterNewPosts(lastExecutedAt).toGithubUploadFiles;
		this.metadata.update(
			this.newPosts,
			this.blogs
		);


		return [this.metadata.githubUploadFile, ...newPosts];
	}
}
