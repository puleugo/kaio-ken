import {HrefTagEnum} from "../type";
import crypto from 'crypto';

import html2md from 'html-to-md';
import {sheets_v4} from "googleapis";
import * as cheerio from 'cheerio';
import {TranslatedPosts} from "./translatedPosts";
import {ImageEntity} from "./image-entity";
import {GithubUploadFile} from "./github-upload-files";

interface HrefLangTag {
	link: string;
	language: HrefTagEnum;
}

interface RawPostInterface {
	title: string;
	content: string;
	uploadedAt: string;
	hasUploadedOnGithub: boolean;
	originUrl: string;
	language: HrefTagEnum;
	images?: ImageEntity[];
	translatedPosts?: TranslatedPosts;
}

export interface PostInterface {
	index: number | null;
	title: string;
	content: string;
	uploadedAt: Date;
	originUrl: string | null;
	images: ImageEntity[];
	language: HrefTagEnum;
}

export interface PostMetadata {
	original: {
		title: string;
		url: string;
		language: HrefTagEnum;
		uploadedAt: string;
	},
	translatedLanguages: HrefTagEnum[],
	translated: {
		[language: string]: {
			title: string;
			url: string;
		}
	}
}

export class PostEntity implements PostInterface {
	index: number | null;
	title: string;
	content: string;
	readonly sha: string;
	uploadedAt: Date;
	originUrl: string;
	language: HrefTagEnum;
	translatedPosts: TranslatedPosts;
	images: Array<ImageEntity> = [];

	get toGithubUploadFiles(): GithubUploadFile {
		return {
			path: `${this.language}/${this.index}.md`,
			content: this.content
		}
	};

	get translatedLanguages() {
		if (!this.translatedPosts) {
			return [];
		}
		return this.translatedPosts.languages;
	}

	get metadata(): TranslatedPosts['postsWithLanguage'] {
		return this.translatedPosts.postsWithLanguage
	}


	get toValue() :sheets_v4.Schema$ValueRange {
		return {
			values: [
				[this.title, this.content, this.uploadedAt.toISOString(), this.originUrl, this.language]
			]
		}
	};

	constructor(props: RawPostInterface, index: number = null) {
		const imageTags = cheerio.load(props.content)('img');
		imageTags.each((_, element) =>  {
			this.images.push(new ImageEntity({
				src: element.attribs.src,
				alt: element.attribs.alt,
				extension: element.attribs.src.split('.').pop(),
				content: null
			}));
		});

		this.content = html2md(props.content);
		this.index = index;
		this.title = props.title;
		this.uploadedAt = new Date(props.uploadedAt);
		this.originUrl = props.originUrl;
		this.language = props.language;
		this.sha = crypto.createHash('sha1').update(this.content).digest('hex');
		this.translatedPosts = props.translatedPosts
	}

	hasPostChanged(post: PostEntity) {
		return this.sha !== post.sha;
	}

	updateTranslate(props: Pick<PostInterface, 'title' | 'content' | 'language'>) {
		this.title = props.title;
		this.content = props.content;
		this.language = props.language;
		this.originUrl = '';
	}

	get HrefLangTags(): HrefLangTag[] {
		const originalWithTranslated: PostEntity[] = [this]
		if (this.translatedPosts) {
			originalWithTranslated.concat(this.translatedPosts.values);
		}
		return originalWithTranslated.map(post => ({
			link: post.originUrl,
			language: post.language,
		}));
	}

	get hrefLangInjectionCode() {
		const hrefLangArrayString = JSON.stringify(this.HrefLangTags)
		return `
			<script>
			document.addEventListener(\'DOMContentLoaded\', () => {
				const hreflangs = ${hrefLangArrayString}
	
				hreflangs.forEach(({ href, hreflang }) => {
			        const link = document.createElement('link');
					link.rel = 'alternate';
			        link.href = href;
				    link.hreflang = hreflang;
				    document.head.appendChild(link);
				});
			});
			</script>`;
	}

	static fromMetadata(index: number,postMetadata: PostMetadata) {
		return new PostEntity({
			title: postMetadata.original.title,
			content: '',
			uploadedAt: postMetadata.original.uploadedAt,
			hasUploadedOnGithub: false,
			originUrl: postMetadata.original.url,
			language: postMetadata.original.language,
			translatedPosts: TranslatedPosts.fromMetadata(index,postMetadata),
		}, index)
	}
}
