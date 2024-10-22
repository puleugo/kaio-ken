import {BlogPlatformEnum, HrefTagEnum, isBlogPlatformEnum, isHrefTageEnum} from "../type";
import dayjs from "dayjs";
import {DateUtil} from "../util/util/DateUtil";

/**
 * @typedef {('PUBLISHER'|'SUBSCRIBER'|'UNSUBSCRIBER')} blogType
 * PUBLISHER: 원글 발행자
 * SUBSCRIBER: 원글을 번역하여 배포하는 구독 블로그
 * UNSUBSCRIBER: 번역글 자동 발행을 중단한 블로그
 */
type blogType = 'PUBLISHER' | 'SUBSCRIBER' | 'UNSUBSCRIBER';

export interface BlogInterface {
	title: string;
	lastPublishedIndex: number;
	lastPublishedAt: Date;
	rssUrl: string;
	platform: BlogPlatformEnum;
	language: HrefTagEnum;
	type: blogType;
}

export interface BlogMetadata {
	title: string;
	platform: BlogPlatformEnum;
	language: HrefTagEnum;
	rssUrl: string;
	lastPublishedIndex: number;
	lastPublishedAt: string;
	type: blogType;
}

export class BlogEntity{
	get metadata(): BlogMetadata {
		return {
			title: this.value.title,
			platform: this.value.platform,
			language: this.value.language,
			rssUrl: this.value.rssUrl,
			lastPublishedIndex: this.value.lastPublishedIndex,
			lastPublishedAt: DateUtil.formatYYYYMMDD(this.value.lastPublishedAt),
			type: this.value.type
		}
	};
	private value: BlogInterface;

	get lastPublishedIndex(): number {
		return this.value.lastPublishedIndex;
	};
	get isPublisher(): boolean {
		return this.value.type === 'PUBLISHER';
	}
	get isUnsubscriber(): boolean {
		return this.value.type === 'UNSUBSCRIBER';
	}
	get rssUrl() {
		return this.value.rssUrl;
	}
	get lastPublishedAt(): Date {
		return this.value.lastPublishedAt;
	}
	get title(): string {
		return this.value.title;
	}


	get toValue() :any[] {
		return [this.value.title, this.value.lastPublishedIndex, dayjs(this.value.lastPublishedAt).format('YYYY-MM-DD'), this.value.rssUrl, this.value.platform, this.value.language, this.value.type ? '=TRUE' : '=FALSE']
	}

	get isValidEntity(): boolean {
		return this.value !== undefined;
	}

	get platform(): BlogPlatformEnum {
		return this.value.platform;
	}

	fetchLastPublishedAt(newPostCount: number) {
		this.value.lastPublishedIndex += newPostCount;
		this.value.lastPublishedAt = new Date();
	}

	constructor(props: BlogInterface | string[]) {
		if (Array.isArray(props)) {
			if (props.length !== 7) {
				return;
			}
			if (BlogEntity.validBlog(props)) { // 이미 1회 이상 갱신된 블로그
				this.value ={
					title : props[0],
					lastPublishedIndex : Number(props[1]),
					lastPublishedAt : new Date(props[2]),
					rssUrl : props[3],
					platform : props[4] as BlogPlatformEnum,
					language : props[5] as HrefTagEnum,
					type : props[6] as blogType,
				}

			}
			else if (BlogEntity.validateShouldInit(props))  // 최초 실행인 경우
			{
				this.value = {
					title: props[0],
					lastPublishedIndex: 0,
					lastPublishedAt: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
					rssUrl: props[3],
					platform: props[4] as BlogPlatformEnum,
					language: props[5] as HrefTagEnum,
					type: props[6] as blogType,
				}
			}
			else {
				return;
			}
		} else {
			this.value = {
				title: props.title,
				lastPublishedIndex : props.lastPublishedIndex,
				lastPublishedAt : props.lastPublishedAt,
				rssUrl : props.rssUrl,
				platform : props.platform,
				language : props.language,
				type : props.type,
			};

		}
	}

	private static validBlog(props: string[]): boolean {
		if (props[0] === undefined || props[0].length <= 0) {
			return false;
		}
		if (props[1] === undefined || !isNaN(Number(props[1])) && Number(props[1]) < 0) {
			return false;
		}
		if (props[2] === undefined || isNaN(Date.parse(props[2]))) {
			return false;
		}
		if (props[3] === undefined || props[3].length <= 0) {
			return false;
		}
		if (!isBlogPlatformEnum(props[4])) {
			return false;
		}
		if (!isHrefTageEnum(props[5])) {
			return false;
		}
		if (!BlogEntity.validateBlogType(props[6])) {
			return false;
		}
		return true;
	}

	private static validateShouldInit(props: string[]) {
		if (props[0].length <= 0) { // 반드시 차있어야함.
			return false;
		}
		if (Number(props[1]) != 0 || props[1].length > 0) { // 0 혹은 비어있어야함
			return false;
		}
		if (props[2].length > 0) { // 비어있어야 함.
			return false;
		}
		if (props[3].length <= 0) { // 반드시 차있어야함.
			return false;
		}
		if (!isBlogPlatformEnum(props[4])) { // 반드시 차있어야함.
			return false;
		}
		if (!isHrefTageEnum(props[5])) { // 반드시 차있어야함.
			return false;
		}
		if (!BlogEntity.validateBlogType(props[6])) { // 반드시 차있어야함.
			return false;
		}
		return true;
	}

	private static validateBlogType(raw: string) {
		return raw !== undefined && (raw === 'PUBLISHER' || raw === 'SUBSCRIBE' || raw === 'UNSUBSCRIBE');
	}
}
