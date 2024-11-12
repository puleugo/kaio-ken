import { Metadata } from "../../src/domain/metadata";
import { Posts } from "../../src/domain/posts";
import { Sitemap } from "../../src/domain/sitemap";
import {GithubReaderInterface} from "../../src/implemention/github.reader";
import {HrefTagEnum} from "../../src/type";
import {TranslatedPosts} from "../../src/domain/translatedPosts";

export class GithubReaderStub implements GithubReaderInterface {
	private _metadata: Metadata | null = null;
	private _sitemap: Sitemap | null = null;
	private _posts: TranslatedPosts = new TranslatedPosts([]);


    async readMetadata(): Promise<Metadata | null> {
		return this._metadata;
    }

    async readPosts(language: HrefTagEnum, shouldTranslatePostIndexes: Set<any>): Promise<Posts> {
		return this._posts.getPostByLanguage(language)
    }
	async readSitemap(): Promise<Sitemap | null> {
		return this._sitemap;
    }
	async readTranslatedPosts(language: HrefTagEnum): Promise<Posts> {
		return this._posts.getPostByLanguage(language);
    }
	set metadata(metadata: Metadata) {
		this._metadata = metadata;
	}
	set siteMap(sitemap: Sitemap) {
		this._sitemap = sitemap;
	}

	reset() {
		this._metadata = null;
		this._sitemap = null;
		this._posts = null;
	}

	uploadPosts(posts: Posts, targetLanguage: HrefTagEnum) {
		this._posts.putPosts(targetLanguage, posts);
	}
}
