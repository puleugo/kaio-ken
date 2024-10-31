import {PostEntity, PostMetadata} from "./postEntity";
import {BlogEntity} from "./blog.entity";
import {GithubUploadFile} from "./github-upload-files";
import {DateUtil} from "../util/util/DateUtil";
import dayjs from "dayjs";
import {HrefTagEnum} from "../type";

export interface PostsMetadata {
	[index: number]: PostMetadata;
}

export class Posts {
	private _blog: BlogEntity | null;
	private posts: PostEntity[]
	get imageGithubFiles(): GithubUploadFile[] {
		return this.posts.flatMap(post => post.images.map(image => ({
			path: `images/${post.index}/${image.filename}`,
			content: image.content,
		})
		));
	};
	get imageUrls(): string[] {
		return this.posts.flatMap(post => post.images.map(image => image.url));
	};

	hasPostIndex(index: number): boolean {
		return this.posts.some(post => post.index === index);
	};

	get first(): PostEntity {
		return this.posts[0];
	}

	get last(): PostEntity {
		return this.posts[this.posts.length - 1];
	}

	get toEntities(): PostEntity[] {
		return this.posts;
	}

	get indexes(): number[] {
		return this.posts.map(post => post.index);
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
				translated: post.translatedPosts.postsWithLanguage,
			}
		)
		return result;
	}

	filterNewPosts(lastSyncedAt: Date = DateUtil.min): Posts {
		return new Posts(this.posts.filter(post => dayjs(post.uploadedAt).isAfter(lastSyncedAt)), this._blog);
	}

	fillIndex(startIndex: number): Posts {
		return new Posts(this.posts.map((post, index) => {post.index = startIndex + index+1; return post}));
	}

	push(post: PostEntity[]) {
		this.posts.push(...post);
	}

	hasPost(post: PostEntity) {
		return this.posts.some(p => p.originUrl === post.originUrl);
	}

	updateByNewData(newPosts: Posts, lastPublishedAt: Date) {
		this.posts = this.posts.concat(newPosts.posts.filter(post => dayjs(post.uploadedAt).isAfter(lastPublishedAt)));
	}

	filterNotTranslatedBy(language: HrefTagEnum): Posts {
		return new Posts(this.posts.filter(post => !post.translatedLanguages.includes(language)));
	}

	getById(id: number): PostEntity | null {
		return this.posts.find(post => post.index === id) || null;
	}

	async map(callback: (post: PostEntity) => Promise<PostEntity>): Promise<PostEntity[]> {
		const promises = this.posts.map(callback);
		return Promise.all(promises);
	}

	// FIXME: TranslatedPost 중복 제거
	addTranslatedPost(postId: number, post: PostEntity) {
		const target = this.posts.find(p => p.index === postId);
		if (target) {
			target.translatedPosts.push(post.language, post);
		}
	}
}
