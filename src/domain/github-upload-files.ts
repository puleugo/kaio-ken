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
			const metadata = new Metadata({posts: this.newPosts, blogs: this.blogs}).githubUploadFile;
			const newPosts = this.newPosts.toGithubUploadFiles;
			return [...newPosts, metadata];
		}
		const newPosts = this.newPosts.toGithubUploadFiles;
		this.metadata.update(
			this.newPosts,
			this.blogs
		);

		return [...newPosts, this.metadata.githubUploadFile];
	}
}
