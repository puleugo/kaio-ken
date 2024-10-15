import {PostEntity} from "./postEntity";
import {BlogEntity} from "./blog.entity";

export class Posts {
	private _blog: BlogEntity | null;
	private posts: PostEntity[]

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

	get subscribeFiles(): {
		path: string;
		content: string;
	}[] {
		this._blog?.fetchLastPublishedAt(this.posts.length);

		return this.posts.map(post => ({
			path: `${post.language}/${post.index}.md`,
			content: post.content,
		}))
	}

	filterNewPosts(lastSyncedAt: Date): Posts {
		return new Posts(this.posts.filter(post => post.uploadedAt > lastSyncedAt), this._blog);
	}
}
