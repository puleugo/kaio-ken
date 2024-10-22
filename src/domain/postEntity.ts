import {HrefTagEnum} from "../type";
import crypto from 'crypto';

interface RawPostInterface {
	title: string;
	content: string;
	uploadedAt: string;
	hasUploadedOnGithub: boolean;
	originUrl: string;
	language: HrefTagEnum;
}

import html2md from 'html-to-md'
import {sheets_v4} from "googleapis";
import {TranslatedPosts} from "./translatedPosts";

export interface PostInterface {
	index: number | null;
	title: string;
	content: string;
	uploadedAt: Date;
	hasUploadedOnGithub: boolean;
	githubUrl: string | null;
	originUrl: string | null;
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
	hasUploadedOnGithub: boolean = false;
	githubUrl: string | null = null;
	originUrl: string;
	language: HrefTagEnum;
	translatedPosts: TranslatedPosts;

	get translatedLanguages() {
		return this.translatedPosts.getLanguages
	}

	get metadata(): TranslatedPosts['metadata'] {
		return this.translatedPosts.metadata
	}


	get toValue() :sheets_v4.Schema$ValueRange {
		return {
			values: [
				[this.title, this.content, this.uploadedAt.toISOString(), this.hasUploadedOnGithub, this.githubUrl, this.originUrl, this.language]
			]
		}
	};

	constructor(props: RawPostInterface, index: number = null) {
		this.index = index;
		this.title = props.title;
		this.content = html2md(props.content);
		this.uploadedAt = new Date(props.uploadedAt);
		this.originUrl = props.originUrl;
		this.language = props.language;
		this.sha = crypto.createHash('sha1').update(this.content).digest('hex');
		this.translatedPosts = new TranslatedPosts([]);
	}

	hasPostChanged(post: PostEntity) {
		return this.sha !== post.sha;
	}

	static fromMetadata(index: number,postMetadata: PostMetadata) {
		return new PostEntity({
			title: postMetadata.original.title,
			content: '',
			uploadedAt: postMetadata.original.uploadedAt,
			hasUploadedOnGithub: false,
			originUrl: postMetadata.original.url,
			language: postMetadata.original.language
		}, index)
	}
}
