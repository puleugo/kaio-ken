import {Posts} from "./posts";
import {Metadata} from "./metadata";
import {Blogs} from "./blogs";
import {TranslatedPosts} from "./translatedPosts";

export interface GithubUploadFile {
	path: string;
	content: string;
}

export class GithubUploadFileBuilder {
	private metadata: Metadata = null;
	private newPosts: Posts = null;
	private blogs: Blogs = null;
	private translatedPosts: TranslatedPosts = null;

	addPosts(newPosts: Posts): GithubUploadFileBuilder {
		this.newPosts = newPosts;
		return this;
	}

	putBlogs(blogs: Blogs): GithubUploadFileBuilder {
		this.blogs = blogs;
		return this
	}

	addTranslatedPosts(translatedPosts: TranslatedPosts): GithubUploadFileBuilder {
		this.translatedPosts = translatedPosts;
		return this;
	}

	putMetadata(metadata: Metadata | null): GithubUploadFileBuilder {
		this.metadata = metadata;
		return this;
	}

	build(): GithubUploadFile[] {
		const result = []
		if (!this.metadata) {
			this.metadata = new Metadata({posts: this.newPosts, blogs: this.blogs});
			result.push(...this.newPosts.toGithubUploadFiles);
		}
		if(this.newPosts && this.blogs) {
			this.metadata.update(this.newPosts, this.blogs);
			result.push(...this.newPosts.toGithubUploadFiles);
			// result.push(...this.newPosts.imageGithubFiles);
		}

		if (this.translatedPosts !== null) {
			this.metadata.addTranslatedPost(this.translatedPosts);
			this.metadata.blogs.updateSubscribeBlogs(this.translatedPosts);
			result.push(...this.translatedPosts.githubUploadFile)
		}

		result.push(this.metadata.githubUploadFile);
		return result;
	}
}
