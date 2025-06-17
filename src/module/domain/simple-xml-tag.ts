import { StringBuilder } from "../../shared/util/string-builder";
import { XmlTag } from "./xml-tag";

export class SimpleXmlTag extends XmlTag {
	private constructor(name: string, value = "", attributes: Record<string, string> = {}) {
		super({ name, value, attributes, children: [] });
	}

	override toString(): string {
		return new StringBuilder()
			.append(`<${this.props.name}>`)
			.append(this.props.value)
			.append(`</${this.props.name}>`)
			.toString();
	}

	static create(name: string, value = "", attributes: Record<string, string> = {}): SimpleXmlTag {
		return new SimpleXmlTag(name, value, attributes);
	}
}
