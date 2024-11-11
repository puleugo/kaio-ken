import { Metadata } from "../../src/domain/metadata";
import { Posts } from "../../src/domain/posts";
import { Sitemap } from "../../src/domain/sitemap";
import {GithubReaderInterface} from "../../src/implemention/github.reader";
import {HrefTagEnum} from "../../src/type";

export class GithubReaderStub implements GithubReaderInterface {
	private _metadata: Metadata | null = null;
	private _sitemap: Sitemap | null = null;
	private _posts: Posts | null = null;
    async readMetadata(): Promise<Metadata | null> {
		return this._metadata;
    }
    async readPosts(language: HrefTagEnum, shouldTranslatePostIndexes: Set<any>): Promise<Posts> {
		if (!this._posts) {
			return null;
		}
		return this._posts;
    }
	async readSitemap(): Promise<Sitemap | null> {
		return this._sitemap;
    }
	async readTranslatedPosts(language: HrefTagEnum): Promise<Posts> {
		if (!this._posts) {
			return new Posts([]);
		}
		return this._posts;
    }
	set metadata(metadata: Metadata) {
		this._metadata = metadata;
	}
	set siteMap(sitemap: Sitemap) {
		this._sitemap = sitemap;
	}
}
