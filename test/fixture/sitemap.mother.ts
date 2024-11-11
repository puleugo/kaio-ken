import {Sitemap} from "../../src/domain/sitemap";
import {DateUtil} from "../../src/util/util/DateUtil";
import {Metadata} from "../../src/domain/metadata";

export class SitemapMother {
	static createByMetadata(metadata: Metadata, ignoreTranslated = true): Sitemap {
		if (ignoreTranslated) {
			return new Sitemap(metadata.posts.map(post => {
				return {
					loc: {_text: post.originUrl},
					lastmod: {_text: DateUtil.nowFormatYYYYMMDD}
				}
			}))
		}
		return new Sitemap(metadata.posts.map(post => {
			return {
				loc: {_text: post.originUrl},
				lastmod: {_text: DateUtil.nowFormatYYYYMMDD},
				"xhtml:link": post.translatedPosts.map(translatedPost => ({
					_attributes: {
						rel: 'alternate',
						hreflang: translatedPost.language,
						href: translatedPost.originUrl,
					}
				}))
			}
		}))
	}
}
