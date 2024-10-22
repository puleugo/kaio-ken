import {PostEntity, PostMetadata} from "./postEntity";
import {BlogEntity} from "./blog.entity";
import {GithubUploadFile} from "./github-upload-files";
import {DateUtil} from "../util/util/DateUtil";

export interface PostsMetadata {
	[index: number]: PostMetadata;
}

export class Posts {
	private _blog: BlogEntity | null;
	private posts: PostEntity[]

	get last(): PostEntity {
		return this.posts[this.posts.length - 1];
	}

	get toEntities(): PostEntity[] {
		return this.posts;
	}

	constructor(posts: PostEntity[], blog: BlogEntity | null = null) {
		this.posts = posts;
		this._blog = blog;
	}

	get isEmpty(): boolean {
		return this.posts.length === 0;
	}

	get length(): number {
		return this.posts.length;
	}

	get blog(): BlogEntity {
		if (!this._blog) {
			throw new Error('No blog');
		}
		return this._blog;
	}

	set blog(blog: BlogEntity) {
		this._blog = blog;
	}

	get toGithubUploadFiles(): GithubUploadFile[] {
		this._blog?.fetchLastPublishedAt(this.posts.length);

		return this.posts.map(post => ({
			path: `${post.language}/${post.index}.md`,
			content: post.content,
		}))
	}

	get metadata(): PostsMetadata {
		const result: PostsMetadata = {}
		this.posts.forEach(post =>
			result[post.index] = {
				original: {
					title: post.title,
					url: post.originUrl,
					language: post.language,
					uploadedAt: DateUtil.formatYYYYMMDD(post.uploadedAt),
				},
				translatedLanguages: post.translatedLanguages,
				translated: post.translatedPosts.metadata,
			}
		)
		return result;
	}

	filterNewPosts(lastSyncedAt: Date = DateUtil.min): Posts {
		return new Posts(this.posts.filter(post => post.uploadedAt > lastSyncedAt), this._blog);
	}

	fillIndex(startIndex: number): Posts {
		return new Posts(this.posts.map((post, index) => {post.index = startIndex + index; return post}));
	}

	push(post: PostEntity) {
		this.posts.push(post);
	}
}
