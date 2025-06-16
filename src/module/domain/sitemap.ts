import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import { ValueObject } from "../../core/value-object";
import { StringBuilder } from "../../shared/util/string-builder";
import type { UrlSet } from "./url-set";
import type { XmlDeclaration } from "./xml-declaration";

export type RawUrl = {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string | number;
	"xhtml:link"?: XhtmlLink | XhtmlLink[];
};

interface XhtmlLink {
	_attributes: {
		rel: string;
		hreflang: string;
		href: string;
	};
}

interface SitemapProperties {
	declaration: XmlDeclaration;
	urlSet: UrlSet;
}

/**
 * Sitemap
 * @see https://www.sitemaps.org/protocol.html
 */
export class Sitemap extends ValueObject<SitemapProperties> {
	private static readonly INVALID_FORMAT = "Invalid sitemap format";
	private static readonly URL_NOT_FOUND = "URL not found";

	private static readonly DEFAULT_XMLNS = "http://www.sitemaps.org/schemas/sitemap/0.9";
	private static readonly XML_PARSER_OPTIONS = { ignoreAttributes: false };
	private static readonly XML_BUILDER_OPTIONS = {
		ignoreAttributes: false,
		format: true,
	};
	static readonly PATH = "sitemap.xml";

	get urlSet(): UrlSet {
		return this.props.urlSet;
	}

	private constructor(value: SitemapProperties) {
		super(value);
	}

	toString(): string {
		const builder = new StringBuilder();
		builder.appendLine(this.props.declaration.toString());
		builder.appendLine(this.props.urlSet.toString());
		return builder.toString();
	}

	static from(props: SitemapProperties): Result<Sitemap> {
		const nullGuard = NullGuard.againstNullOrUndefinedBulk([
			{ argument: props.declaration, argumentName: "desclaration" },
			{ argument: props.urlSet, argumentName: "urlset" },
		]);
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());

		return Result.success(new Sitemap(props));
	}
}
