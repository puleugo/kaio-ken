import type { RssPostDto } from "../dto/rss-post.dto";
import { PostUrl } from "./post-url";
import type { PostEntity } from "./post.entity";

export class Posts {
	private posts: ReadonlyArray<PostEntity>;

	get isEmpty(): boolean {
		return this.posts.length === 0;
	}

	get length(): number {
		return this.posts.length;
	}

	private constructor(posts: PostEntity[]) {
		this.posts = posts;
	}

	filterUnUploaded(posts: RssPostDto[]): RssPostDto[] {
		return posts.filter((post) => {
			const urlOrFailure = PostUrl.from(post.guid ?? post.link);
			if (urlOrFailure.isFailed) return false;
			return !this.posts.some((p) => p.url.equals(urlOrFailure.getValue()));
		});
	}

	getAll(): Array<PostEntity> {
		return [...this.posts];
	}

	static create(posts: PostEntity[]): Posts {
		return new Posts(posts);
	}
}
