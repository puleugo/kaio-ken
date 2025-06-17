import type { Metadata } from "@src/module/domain/metadata";
import { Sitemap } from "@src/module/domain/sitemap";
import { UrlSet } from "@src/module/domain/url-set";
import { UrlTag } from "@src/module/domain/url-tag";
import { XmlDeclaration } from "@src/module/domain/xml-declaration";

export namespace SitemapMother {
	export function createByMetadata(metadata: Metadata): Sitemap {
		const urlTag = UrlTag.create({ location: metadata.publisher.url.toUrl() }).getValue();
		const urlSet = UrlSet.create({
			xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			"xmlns:xhtml": "http://www.w3.org/1999/xhtml",
			urlSet: [urlTag],
		});

		return Sitemap.from({
			declaration: XmlDeclaration.create({
				version: 1.0,
				encoding: "UTF-8",
			}),
			urlSet,
		}).getValue();
	}

	export function createEmpty(): Sitemap {
		const urlSet = UrlSet.create({
			xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			"xmlns:xhtml": "http://www.w3.org/1999/xhtml",
			urlSet: [],
		});

		return Sitemap.from({
			declaration: XmlDeclaration.create({
				version: 1.0,
				encoding: "UTF-8",
			}),
			urlSet,
		}).getValue();
	}
}
