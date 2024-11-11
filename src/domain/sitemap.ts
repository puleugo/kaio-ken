import {json2xml, xml2json} from "xml-js";
import {Metadata} from "./metadata";
import {HrefTagEnum} from "../type";
import {FileUtil} from "../util/util/FileUtil";

interface UrlSetValue {
	_attributes: {
		xmlns: string;
		'xmlns:xhtml'?: string;
	}
	script?: Array<{
		_attributes: {
			id?: string;
			src?: string;
		}
		_text?: string;
	}>
	url: Array<UrlValue>
}

interface UrlValue {
	loc: {
		_text: string;
	};
	'xhtml:link'?: Array<XhtmlLink>
	lastmod?: {
		_text: string;
	}; // YYYY-MM-DD
	changefreq?: {
		_text: string;
	}; // always, hourly, daily, weekly, monthly, yearly, never
	priority?: {
		_text: string;
	}; // 0.0 ~ 1.0
}

interface XhtmlLink {
	_attributes: {
		rel: string;
		hreflang: HrefTagEnum;
		href: string;
	}
}

interface SitemapValue {
	_declaration: {
		_attributes: {
			version: string;
			encoding: string;
		}
	}
	urlset: UrlSetValue
}

/**
 * Sitemap
 * @see https://www.sitemaps.org/protocol.html
 */
export class Sitemap {

	static readonly path = 'sitemap.xml';
	// 파싱 작업 시 compact 모드로 설정, 라이브러리 기본값은 false이므로 항상 이 값을 사용
	// https://www.npmjs.com/package/xml-js
	private static isCompact = true;

	private static defaultHeader: SitemapValue = {
		_declaration: {
			_attributes: {
				version: '1.0',
				encoding: 'UTF-8',
			}
		},
		urlset: {
			_attributes: {
				xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				"xmlns:xhtml": 'http://www.w3.org/1999/xhtml',
			},
			url: []
		}
	};

	private sitemap: SitemapValue;
	constructor(urls: Array<UrlValue>) {
		this.sitemap = Sitemap.defaultHeader;
		this.sitemap.urlset.url = urls;
	}

	get value(): string {
		// replace blog url to custom domain url
		return json2xml(JSON.stringify(this.sitemap), {compact: Sitemap.isCompact, spaces: FileUtil.fileSpaces});
	}

	get isEmpty(): boolean {
		return this.value === '';
	}

	static from(raw: string): Sitemap {
		const sitemapJson = JSON.parse(xml2json(raw, {compact: Sitemap.isCompact}));
		return new Sitemap(sitemapJson.urlset.url);
	}

	get urls(): Array<UrlValue> {
		return this.sitemap.urlset.url;
	}

	update(metadata: Metadata): void {
		console.log(this.sitemap)
		metadata.posts.map(metadataPost => {
			const sitemapPost = this.sitemap.urlset.url.find(url => url.loc._text === metadataPost.originUrl);
			if (!sitemapPost) {
				this.sitemap.urlset.url.push({
					loc: {_text: metadataPost.originUrl},
					"xhtml:link":
						metadataPost.translatedPosts.map(translatedPost => ({
							_attributes: {
								rel: 'alternate',
								hreflang: translatedPost.language,
								href: translatedPost.originUrl,
							}
						}))
				});
				return;
			}
			metadataPost.translatedPosts.map(translatedPost => {
				if (!sitemapPost['xhtml:link']) {
					sitemapPost['xhtml:link'] = [];
				}
				if(!(sitemapPost["xhtml:link"] instanceof Array)) { // xhtml:link이 1개일 경우 배열로 변환
					sitemapPost["xhtml:link"] = [sitemapPost["xhtml:link"] as unknown as XhtmlLink];
				}
				const xhtmlLink = sitemapPost['xhtml:link'].find(xhtmlLink => xhtmlLink._attributes.hreflang === translatedPost.language);
				if (!xhtmlLink) {
					sitemapPost['xhtml:link'].push({
						_attributes: {
							rel: 'alternate',
							hreflang: translatedPost.language,
							href: translatedPost.originUrl,
						}
					});
					return;
				}
				xhtmlLink._attributes.href = translatedPost.originUrl;
			});
		})
		return;
	}
}
