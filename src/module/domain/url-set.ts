import { XMLParser } from "fast-xml-parser";
import { ValueObject } from "../../core/value-object";
import { StringBuilder } from "../../shared/util/string-builder";
import type { UrlTag } from "./url-tag";
import type { XhtmlTag } from "./xhtml-tag";

interface UrlSetProperties {
	xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9";
	"xmlns:xhtml"?: "http://www.w3.org/1999/xhtml";
	urlSet: ReadonlyArray<UrlTag>;
}

export class UrlSet extends ValueObject<UrlSetProperties> {
	private xmlParser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
		trimValues: true,
	});

	private constructor(value: UrlSetProperties) {
		super(value);
	}

	contains(urlTag: UrlTag): boolean {
		return this.props.urlSet.some((tag) => tag.equals(urlTag));
	}

	putUrl(urlTag: UrlTag): UrlSet {
		if (this.contains(urlTag)) return this;

		const newUrlTags = [...this.props.urlSet.map((url) => url)];
		newUrlTags.push(urlTag);

		return new UrlSet({
			...this.props,
			urlSet: newUrlTags,
		});
	}

	putUrls(urlTags: UrlTag[]): UrlSet {
		const newUrlTags = [...this.props.urlSet.map((url) => url)];
		for (const urlTag of urlTags) {
			if (!this.contains(urlTag)) {
				newUrlTags.push(urlTag);
			}
		}

		return new UrlSet({
			...this.props,
			urlSet: newUrlTags,
		});
	}

	putXhtml(xhtmlTag: XhtmlTag): UrlSet {
		const newUrl = this.props.urlSet.map((url) => url);
		const found = newUrl.find((url) => url.isSameLocation(xhtmlTag.location));
		if (!found) throw new Error("Cannot put xhtml tag to url set, because there is no url with the same location");
		found.addChild(xhtmlTag);

		return this;
	}

	override toString(): string {
		const builder = new StringBuilder();
		builder.append(`<urlset xmlns="${this.props.xmlns}"`);
		if (this.props["xmlns:xhtml"]) {
			builder.append(` xmlns:xhtml="${this.props["xmlns:xhtml"]}"`);
		}
		builder.appendLine(">");

		for (const tag of this.props.urlSet) {
			builder.appendLine(tag.toString());
		}

		builder.append("</urlset>");
		return builder.toString();
	}

	static create(value: UrlSetProperties): UrlSet {
		return new UrlSet({
			xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			"xmlns:xhtml": "http://www.w3.org/1999/xhtml",
			urlSet: value.urlSet,
		});
	}
}
