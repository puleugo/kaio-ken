import { ValueObject } from "../../core/value-object";
import { StringBuilder } from "../../shared/util/string-builder";

interface XmlDeclarationTagProperties {
	name?: string;
	version?: number;
	encoding?: string;
}

export class XmlDeclaration extends ValueObject<XmlDeclarationTagProperties> {
	private constructor(props: XmlDeclarationTagProperties) {
		super(props);
	}

	toString(): string {
		const builder = new StringBuilder();
		builder.append(`<?${this.props.name}`);
		builder.append(`version="${this.props.version?.toFixed(1)}"`);
		builder.append(`encoding="${this.props.encoding}"?>`);
		return builder.toString(" ");
	}

	static create(props: XmlDeclarationTagProperties) {
		return new XmlDeclaration({
			name: props.name ?? "xml",
			version: props.version ? Number(props.version) : 1,
			encoding: props.encoding ?? "UTF-8",
		});
	}
}
