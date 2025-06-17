import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import type { Language } from "./language";
import { XmlTag } from "./xml-tag";

interface XhtmlTagProperties {
	location: URL;
	language: Language;
	href: URL;
}

export class XhtmlTag extends XmlTag {
	private childProps: XhtmlTagProperties;
	get location(): URL {
		return this.childProps.location;
	}

	private constructor(value: XhtmlTagProperties) {
		const attributes = {
			rel: "alternate",
			hreflang: value.language.toString(),
			href: value.href.toString(),
		};

		super({
			name: "xhtml:link",
			attributes,
			value: "",
			children: [],
		});
		this.childProps = value;
	}

	static create(value: XhtmlTagProperties): Result<XhtmlTag> {
		const nullGuard = NullGuard.againstNullOrUndefinedBulk([
			{ argument: value.location, argumentName: "location" },
			{ argument: value.language, argumentName: "language" },
			{ argument: value.href, argumentName: "href" },
		]);
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());

		return Result.success(new XhtmlTag(value));
	}
}
