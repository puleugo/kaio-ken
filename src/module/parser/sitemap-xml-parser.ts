import { NullGuard } from "@src/core/null-guard";
import type { BlogEntity } from "@src/module/domain/blog.entity";
import type { PostEntity } from "@src/module/domain/post.entity";
import { Sitemap } from "@src/module/domain/sitemap";
import type { Translation } from "@src/module/domain/translation";
import { UrlSet } from "@src/module/domain/url-set";
import { UrlTag } from "@src/module/domain/url-tag";
import { XhtmlTag } from "@src/module/domain/xhtml-tag";
import { XmlDeclaration } from "@src/module/domain/xml-declaration";
import { DateUtil } from "@src/shared/util/date.util";
import { XMLParser } from "fast-xml-parser";

export namespace SitemapXmlParser {
	export function parseBlogUrl(blog: BlogEntity): UrlTag {
		const tagOrError = UrlTag.create({ location: blog.url.toUrl() });
		if (!tagOrError.isSucceed) throw new Error(tagOrError.getReason());

		return tagOrError.getValue();
	}

	export function parseTranslationUrl(originalUrl: URL, translation: Translation): XhtmlTag {
		const translationUrlOrNull = translation.url;
		if (!translationUrlOrNull) throw new Error("Unuploaded post cannot parse to xml tag");
		const tagOrFailed = XhtmlTag.create({
			location: originalUrl,
			language: translation.language,
			href: translationUrlOrNull.toUrl(),
		});

		if (tagOrFailed.isFailed) throw new Error(tagOrFailed.getReason());

		return tagOrFailed.getValue();
	}

	export function parsePostUrl(post: PostEntity): UrlTag {
		const result = UrlTag.create({
			location: post.url.toUrl(),
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		});
		if (result.isFailed) throw new Error(result.getReason());
		const urlTag = result.getValue();

		for (const translation of post.translationMap.getValues()) {
			urlTag.addChild(SitemapXmlParser.parseTranslationUrl(post.url.toUrl(), translation));
		}

		return urlTag;
	}
	export function parsePostUrls(posts: PostEntity[]): UrlTag[] {
		return posts.map((post) => SitemapXmlParser.parsePostUrl(post));
	}

	export function fromString(raw: string): Sitemap {
		const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "", trimValues: true });
		const root = parser.parse(raw);

		const declaration = root["?xml"];
		const nullGuard = NullGuard.againstNullOrUndefinedBulk([
			{ argument: declaration, argumentName: "XML declaration" },
			{ argument: root.urlset, argumentName: "URL set" },
		]);
		if (nullGuard.isFailed) throw new Error(`Invalid XML format: ${nullGuard.getReason()}`);

		const urlTags: UrlTag[] = [];
		const urlset = root.urlset;
		for (const rawUrlTag of Array(urlset.url).flat()) {
			const urlTagOrFailed = UrlTag.create({
				location: new URL(rawUrlTag.loc),
				lastModified: rawUrlTag.lastmod ? DateUtil.fromString(rawUrlTag.lastmod) : undefined,
				changeFrequency: rawUrlTag.changefreq,
				priority: rawUrlTag.priority ? Number.parseFloat(rawUrlTag.priority) : undefined,
			});
			if (urlTagOrFailed.isFailed) throw new Error(`Failed to parse URL tag: ${urlTagOrFailed.getReason()}`);

			const urlTag = urlTagOrFailed.getValue();

			if (rawUrlTag["xhtml:link"]) {
				const xhtmlTagOrFailed = XhtmlTag.create({
					location: urlTag.location,
					language: rawUrlTag["xhtml:link"].hreflang,
					href: new URL(rawUrlTag["xhtml:link"].href),
				});
				if (xhtmlTagOrFailed.isFailed) throw new Error(`Failed to parse XHTML tag: ${xhtmlTagOrFailed.getReason()}`);

				urlTag.addChild(xhtmlTagOrFailed.getValue());
			}
			urlTags.push(urlTag);
		}
		const urlSet = UrlSet.create({ xmlns: urlset.xmlns, urlSet: urlTags });

		return Sitemap.from({
			declaration: XmlDeclaration.create({
				version: declaration.version,
				encoding: declaration.encoding,
			}),
			urlSet: urlSet,
		}).getValue();
	}
}
