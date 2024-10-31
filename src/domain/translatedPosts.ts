import {HrefTagEnum} from "../type";
import {PostEntity} from "./postEntity";
import {Posts} from "./posts";
import {GithubUploadFile} from "./github-upload-files";

interface TranslatedPostWithLanguage {
	[language: string]: {
		title: string;
		url: string;
	}
}

export class TranslatedPosts {
	private readonly translatedPosts: Map<HrefTagEnum, Posts> = new Map<HrefTagEnum, Posts>();
	get githubUploadFile(): Array<GithubUploadFile> {
		const result: Array<GithubUploadFile> = []
		this.translatedPosts.forEach((posts) => {
			result.push(...posts.toGithubUploadFiles);
		})
		return result;
	};

	constructor(translatedPosts : PostEntity[]) {
		if (translatedPosts.length === 0) {
			return;
		}
		const temp = new Map<HrefTagEnum, PostEntity[]>();
		translatedPosts.forEach(post => {
			if (temp.has(post.language)) {
				temp.get(post.language).push(post);
			} else {
				temp.set(post.language, [post]);
			}
		})
		temp.forEach((posts, language) => {
			this.translatedPosts.set(language, new Posts(posts));
		})
	}

	getPostByIdAndLanguage(id: number, language: HrefTagEnum): PostEntity | null{
		return this.translatedPosts.get(language).getById(id);
	}

	get getLanguages(): HrefTagEnum[] {
		return Array.from(this.translatedPosts.keys());
	}

	get postsWithLanguage(): TranslatedPostWithLanguage {
		let result = {};
		this.translatedPosts.forEach((posts, language) => {
			result[language] = posts.toEntities.map(post => ({
				title: post.title,
				url: post.originUrl,
			}))
		})
		return result;
	}

	async map(callback: (post: PostEntity) => Promise<PostEntity>): Promise<PostEntity[]> {
		const promises: Promise<PostEntity[]>[] = [];

		this.translatedPosts.forEach(posts => {
			promises.push(posts.map(callback));
		});

		// 모든 Posts 인스턴스의 결과를 평탄화하여 반환
		const result = await Promise.all(promises);
		return result.flat();
	}

	getPostByLanguage(targetLanguage: HrefTagEnum): Posts {
		return this.translatedPosts.get(targetLanguage);
	}

	putPosts(language: HrefTagEnum, posts: Posts): void {
		this.translatedPosts.set(language, posts);
	}

	push(language: HrefTagEnum, post: PostEntity) {
		if (this.translatedPosts.has(language)) {
			this.translatedPosts.get(language).push([post]);
		} else {
			this.translatedPosts.set(language, new Posts([post]));
		}
	}
}


