import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import { StringBuilder } from "../../shared/util/string-builder";
import { SimpleXmlTag } from "./simple-xml-tag";
import { XmlTag } from "./xml-tag";

interface UrlTagProperties {
	location: URL;
	lastModified?: Date;
	changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
	priority?: number;
}

export class UrlTag extends XmlTag {
	private childProps: UrlTagProperties;

	static readonly INVALID_PRIORITY = "The priority must be between 0 and 1";

	get location(): URL {
		return this.childProps.location;
	}

	private constructor(value: UrlTagProperties) {
		const children: Array<XmlTag> = [];
		if (value.location) children.push(SimpleXmlTag.create("loc", value.location.toString()));
		if (value.lastModified) children.push(SimpleXmlTag.create("lastmod", value.lastModified.toISOString()));
		if (value.changeFrequency) children.push(SimpleXmlTag.create("changefreq", value.changeFrequency));
		if (value.priority !== undefined) children.push(SimpleXmlTag.create("priority", value.priority.toFixed(1)));

		super({ name: "url", value: "", attributes: {}, children });
		this.childProps = value;
	}

	isSameLocation(url: URL): boolean {
		return this.childProps.location.toString() === url.toString();
	}

	override toString(): string {
		const builder = new StringBuilder();
		builder.appendLine("\t<url>");
		for (const child of this.props.children) {
			builder.appendLine(`\t\t${child.toString()}`);
		}
		builder.append("\t</url>");
		return builder.toString();
	}

	override equals(vo: UrlTag): boolean {
		return this.childProps.location.toString() === vo.childProps.location.toString();
	}

	static create(value: UrlTagProperties): Result<UrlTag> {
		const nullGuard = NullGuard.againstNullOrUndefined({ argument: value.location, argumentName: "location" });
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());

		if (value.priority !== undefined && (value.priority < 0 || value.priority > 1))
			return Result.fail(UrlTag.INVALID_PRIORITY);

		return Result.success(new UrlTag(value));
	}
}
