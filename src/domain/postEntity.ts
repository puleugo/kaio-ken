import {HrefTagEnum} from "../type";

interface RawPostInterface {
	title: string;
	content: string;
	uploadedAt: string;
	hasUploadedOnGithub: boolean;
	originUrl: string | null;
	language: HrefTagEnum;
}

import html2md from 'html-to-md'
import {sheets_v4} from "googleapis";
export interface PostInterface {
	index: number;
	title: string;
	content: string;
	uploadedAt: Date;
	hasUploadedOnGithub: boolean;
	githubUrl: string | null;
	originUrl: string | null;
	language: HrefTagEnum;
}

export class PostEntity implements PostInterface {
	index: number;
	title: string;
	content: string;
	uploadedAt: Date;
	hasUploadedOnGithub: boolean = false;
	githubUrl: string | null = null;
	originUrl: string | null;
	language: HrefTagEnum;
	get toValue() :sheets_v4.Schema$ValueRange {
		return {
			values: [
				[this.title, this.content, this.uploadedAt.toISOString(), this.hasUploadedOnGithub, this.githubUrl, this.originUrl, this.language]
			]
		}
	};

	constructor(props: RawPostInterface, index: number) {
		this.index = index;
		this.title = props.title;
		this.content = html2md(props.content);
		this.uploadedAt = new Date(props.uploadedAt);
		this.originUrl = props.originUrl;
		this.language = props.language;
	}
}
