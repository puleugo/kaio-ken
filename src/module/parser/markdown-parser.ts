import { PostEntity } from "@src/module/domain/post.entity";
import type { Translation } from "@src/module/domain/translation";
import type { UploadableFileDto } from "@src/module/dto/uploadable-file.dto";
import { PostParser, type PostParserProps } from "@src/module/parser/post-parser";
import { StringBuilder } from "@src/shared/util/string-builder";
import YAML from "yaml";

export interface ParsedMarkdown {
	frontMatter: Record<string, string>;
	content: string;
}

type PostFrontMatter = Pick<PostParserProps, "title" | "language"> & {
	uploadedAt: string | null;
	url: string | null;
};

export namespace MarkdownParser {
	const INVALID_MARKDOWN = "Invalid markdown format";
	const FRONT_MATTER_REGEX = /^---\n([\s\S]*?)\n---\n?/;

	export function parseFromMarkdown(markdown: string): ParsedMarkdown {
		const match = markdown.match(FRONT_MATTER_REGEX);
		if (!match) throw new Error(INVALID_MARKDOWN);
		const [, yamlContent] = match;

		const frontMatter = YAML.parse(yamlContent);
		const content = markdown.slice(match[0].length);
		return { frontMatter, content };
	}

	export function parseToFile(post: PostEntity | Translation): UploadableFileDto {
		const frontMatter: PostFrontMatter = {
			title: post.title.toString(),
			uploadedAt: post.uploadedAt?.toString() ?? null,
			url: post.url?.toString() ?? null,
			language: post.language.toString(),
		};

		const fileString = new StringBuilder()
			.appendLine("---")
			.appendLine(`title: ${frontMatter.title}`)
			.appendLine(`uploadedAt: ${frontMatter.uploadedAt}`)
			.appendLine(`url: ${frontMatter.url}`)
			.appendLine(`language: ${frontMatter.language}`)
			.appendLine("---")
			.appendLine(post.content.toString())
			.toString();

		return {
			path: PostParser.getPath(post.language, post.id),
			content: Buffer.from(fileString),
		};
	}

	export function parseToFiles(post: PostEntity | Translation): UploadableFileDto[] {
		const dtos: Array<UploadableFileDto> = [];

		if (post instanceof PostEntity) {
			const translations = post.translationMap.getValues();
			dtos.push(...translations.map(MarkdownParser.parseToFile));
		}
		dtos.push(MarkdownParser.parseToFile(post));

		return dtos;
	}
}
