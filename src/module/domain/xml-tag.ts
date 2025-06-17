import { ValueObject } from "../../core/value-object";
import { StringBuilder } from "../../shared/util/string-builder";

export interface XmlTagProperties {
	name: string;
	attributes?: Record<string, string>;
	value?: string;
	children?: Array<XmlTag>;
}

export abstract class XmlTag extends ValueObject<Required<XmlTagProperties>> {
	addChild(child: XmlTag) {
		this.props.children.push(child);
	}

	toString(): string {
		const { name, attributes, value, children } = this.props;

		const builder = new StringBuilder();
		for (const attribute of Object.entries(attributes)) {
			builder.append(`${attribute[0]}="${attribute[1]}"`);
		}
		const attrs = builder.toString(" ");

		if (children.length === 0 && value.length === 0) return `<${name}${attrs ? ` ${attrs}` : ""} />`;

		const startTag = `<${name}${attrs.length > 0 ? ` ${attrs}` : ""}>`;
		const endTag = `</${name}>`;
		const childrenStr = children.map((child) => child.toString()).join(" ");
		return `${startTag}${value}${childrenStr}${endTag}`;
	}
}
