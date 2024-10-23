import {Posts, PostsMetadata} from "./posts";
import {Blogs, BlogsMetadata} from "./blogs";
import {GithubUploadFile} from "./github-upload-files";
import {PostEntity} from "./postEntity";
import {DateUtil} from "../util/util/DateUtil";
import {BlogEntity} from "./blog.entity";

interface JsonConstructor  {
	posts: PostsMetadata;
	blogs: BlogsMetadata
	lastExecutedAt: string;
}
interface DomainConstructor {
	posts: Posts;
	blogs: Blogs;
}

export class Metadata {
	static path = 'metadata.json';
	private value: JsonConstructor;
	get publishBlog(): BlogEntity{
		const blogMetadata = this.value.blogs.find(blog => blog.type === 'PUBLISHER');
		return new BlogEntity({...blogMetadata, lastPublishedAt: new Date(blogMetadata.lastPublishedAt)});
	}
	constructor(props: JsonConstructor | DomainConstructor) {
		if (props.posts instanceof Posts && props.blogs instanceof Blogs) { // DomainConstructor
			this.value = {
				lastExecutedAt: DateUtil.formatYYYYMMDD(new Date()),
				posts: props.posts.fillIndex(1).metadata,
				blogs: props.blogs.metadata
			}
		} else {
			this.value = props as JsonConstructor;
		}
		this.validate()
		this.setDefaultIfUndefined();
	}

	static fromJson(json: string): Metadata {
		return new Metadata(JSON.parse(json));
	}

	get postLength(): number {
		return Object.keys(this.value.posts).length;
	}

	get blogLength(): number {
		return this.value.blogs.length;
	}

	get json(): string {
		return JSON.stringify(this.value, null, 2)
	}

	get lastExecutedAt(): Date {
		return new Date(this.value.lastExecutedAt);
	}

	get postsCollection(): Posts {
		const posts: PostEntity[] = [];
		for (const [index, value] of Object.entries(this.value.posts)) {
			posts.push(PostEntity.fromMetadata(Number(index), value));
		}

		return new Posts(posts);
	}

	get githubUploadFile(): GithubUploadFile {
		return {
			path: Metadata.path,
			content: this.json
		}
	}

	update(posts: Posts, blogs?: Blogs): void {
		const newMetadata = posts.metadata;
		for (const [index, post] of Object.entries(newMetadata)) {
			if (index === null || this.value.posts[index] === undefined) {
				continue
			}
			this.value.posts[index] = post
		}

		const lastPost = this.postsCollection.last
		const newPosts = posts.filterNewPosts(lastPost.uploadedAt);
		newPosts.fillIndex(lastPost.index + 1);
		Object.entries(newPosts.metadata).forEach(([index, post]) => {
			this.value.posts[index] = post
		})
		this.value.lastExecutedAt = DateUtil.formatYYYYMMDD(new Date());

		if (blogs) {
			this.value.blogs = blogs.metadata;
		}
		this.validate();
	}

	private validate() {
		const publisherBlog = this.value.blogs.find(blog => blog.type === 'PUBLISHER');
		if (!publisherBlog) {
			throw new Error(`Publisher 블로그가 존재하지 않습니다. ${Metadata.path} 생성에 실패했습니다.`);
		}
	}

	private setDefaultIfUndefined() {
		if (!this.value.lastExecutedAt) {
			this.value.lastExecutedAt = new Date().toISOString();
		}
		if (!this.value.posts) {
			this.value.posts = [];
		}
		if (!this.value.blogs) {
			this.value.blogs = [];
		}
	}
}
