import {BlogPlatformEnum, HrefTagEnum, isBlogPlatformEnum} from "../type";
import {DateUtil} from "../util/util/DateUtil";
import {Posts} from "./posts";

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

	// SpreadSheet를 통해 수정할 수 있는 필드의 값을 반환합니다.
	get getEditableValue(): Pick<BlogInterface, 'title' | 'rssUrl' | 'platform' | 'language' | 'type'> {
		return {
			title: this.value.title,
			rssUrl: this.value.rssUrl,
			platform: this.value.platform,
			language: this.value.language,
			type: this.value.type,
		}
	};
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
	private readonly blogLanguageMap = new Map<BlogPlatformEnum, HrefTagEnum>([
		[BlogPlatformEnum.Tistory, HrefTagEnum.Korean],
		[BlogPlatformEnum.Velog, HrefTagEnum.Korean],
		[BlogPlatformEnum.Medium, HrefTagEnum.English],
		[BlogPlatformEnum.Qiita, HrefTagEnum.Japanese],
	]);

	private value: BlogInterface;

	addPosts(publishedPosts: Posts): void {
		this.value.lastPublishedIndex += publishedPosts.length;
	}

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

	fetchPublishedAt() {
		this.value.lastPublishedAt = new Date();
	}


	get toValue() :any[] {
		return [this.value.title, this.value.lastPublishedIndex, DateUtil.formatYYYYMMDD(this.value.lastPublishedAt), this.value.rssUrl, this.value.platform, this.value.type]
	}

	get platform(): BlogPlatformEnum {
		return this.value.platform;
	}

	fetchPublishedInfo(publishedPosts: Posts) {
		this.value.lastPublishedIndex = publishedPosts.last.index;
		this.value.lastPublishedAt = new Date();
	}

	constructor(props: BlogInterface | string[]) {
		if (Array.isArray(props)) {
			if (props.length !== 6) {
				return;
			}
			if (BlogEntity.validBlog(props)) { // 이미 1회 이상 갱신된 블로그
				this.value = {
					title: props[0],
					lastPublishedIndex: Number(props[1]),
					lastPublishedAt: new Date(props[2]),
					rssUrl: props[3],
					platform: props[4] as BlogPlatformEnum,
					language: this.blogLanguageMap.get(props[4] as BlogPlatformEnum),
					type: props[5] as blogType,
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
					language: this.blogLanguageMap.get(props[4] as BlogPlatformEnum),
					type: props[5] as blogType,
				}
			}
			else {
				throw new Error(`잘못된 블로그 정보가 있습니다.${props}`);
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
		if (props[3] === undefined || (props[3].length === 0 && props[5] === 'PUBLISHER')) { // rss url은 subsriber라면 필요없음.
			return false;
		}
		if (!isBlogPlatformEnum(props[4])) {
			return false;
		}
		if (!BlogEntity.validateBlogType(props[5])) { // 반드시 차있어야함.
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
		if (props[3].length || (props[3].length === 0 && props[5] === 'PUBLISHER')) { // 반드시 차있어야함.
			return false;
		}
		if (!isBlogPlatformEnum(props[4])) { // 반드시 차있어야함.
			return false;
		}
		if (!BlogEntity.validateBlogType(props[5])) { // 반드시 차있어야함.
			return false;
		}
		return true;
	}

	private static validateBlogType(raw: string) {
		return raw !== undefined && (raw === 'PUBLISHER' || raw === 'SUBSCRIBER' || raw === 'UNSUBSCRIBER');
	}

	// SpreadSheet에 업로드된 블로그 정보를 기반으로 블로그 엔티티를 생성한다.
	merge(publisherBlog: BlogEntity): BlogEntity {
		return new BlogEntity(Object.assign(this.value, publisherBlog.getEditableValue))
	}

	unsubscribe() {
		this.value.type = 'UNSUBSCRIBER';
	}
}
