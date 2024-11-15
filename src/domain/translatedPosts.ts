import {HrefTagEnum} from "../type";
import {PostEntity, PostMetadata} from "./postEntity";
import {Posts} from "./posts";
import {GithubUploadFile} from "./github-upload-files";
import {DateUtil} from "../util/util/DateUtil";

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
		translatedPosts = translatedPosts.filter(post => post !== undefined);
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
		const posts = this.translatedPosts.get(language);
		if (!posts) {
			return null;
		}
		return this.translatedPosts.get(language).getById(id);
	}

	get languages(): HrefTagEnum[] {
		return Array.from(this.translatedPosts.keys());
	}

	get postsWithLanguage(): TranslatedPostWithLanguage {
		const result = {};
		this.translatedPosts.forEach((posts, language) => {
			result[language] = posts.toEntities.map(post => ({
				title: post.title,
				url: post.originUrl,
			}))
		})
		return result;
	}

	map<U>(callback: (post: PostEntity) => U): U[] {
		return Array.from(this.translatedPosts.values()).flatMap(post => post.map(callback));
	}

	getPostByLanguage(targetLanguage: HrefTagEnum): Posts {
		if (!this.translatedPosts.has(targetLanguage)) {
			return new Posts([]);
		}
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

	static fromMetadata(id: number, postMetadata: PostMetadata): TranslatedPosts {
		const posts = [];
		postMetadata.translatedLanguages.forEach(language => {
			posts.push(new PostEntity({
				title: postMetadata.translated[language][0].title,
				content: '',
				language: language,
				hasUploadedOnGithub: false,
				originUrl: postMetadata.translated[language][0].url,
				uploadedAt: DateUtil.formatYYYYMMDD(new Date()),
			}, id))
		})
		return new TranslatedPosts(posts);
	}

	get values(): PostEntity[] {
		return Array.from(this.translatedPosts.values()).flatMap(posts => posts.toEntities);
	}

	pushPosts(language: HrefTagEnum, alreadyUploadedPosts: Posts) {
		if (!this.translatedPosts.has(language)) {
			this.translatedPosts.set(language, alreadyUploadedPosts);
			return;
		}
		this.translatedPosts.get(language).push(alreadyUploadedPosts.toEntities);
	}

	getComplement(posts: TranslatedPosts) {
		const complementPosts = [] // 결과물
		this.translatedPosts.forEach((value, language) => {
			if (posts.getPostByLanguage(language).isEmpty) {
				complementPosts.push(...value.toEntities);
				return
			}
			const existPosts = this.translatedPosts.get(language);
			const complementTranslatedPosts = value.getComplement(existPosts);
			complementPosts.push(...complementTranslatedPosts.toEntities);
		})
		return new TranslatedPosts(complementPosts);
	}

	static fromPosts(alreadyUploadedPosts: Posts) {
		return new TranslatedPosts(alreadyUploadedPosts.toEntities);
	}

	forEach(callback: (posts: Posts, language: HrefTagEnum) => void) {
		this.translatedPosts.forEach(callback);
	}
}


