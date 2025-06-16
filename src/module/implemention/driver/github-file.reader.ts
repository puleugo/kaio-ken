import path from "node:path";
import { UniqueEntityId } from "@src/core/unique-identifier";
import type { Language } from "@src/module/domain/language";
import { Metadata } from "@src/module/domain/metadata";
import { PostEntity } from "@src/module/domain/post.entity";
import { Posts } from "@src/module/domain/posts";
import { Sitemap } from "@src/module/domain/sitemap";
import type { Translation } from "@src/module/domain/translation";
import { Translations } from "@src/module/domain/translations";
import type { FileReader } from "@src/module/implemention/file.reader";
import { MarkdownParser } from "@src/module/parser/markdown-parser";
import { MetadataYamlParser } from "@src/module/parser/metadata-yaml.parser";
import { PostParser, type PostParserProps } from "@src/module/parser/post-parser";
import { SitemapXmlParser } from "@src/module/parser/sitemap-xml-parser";
import type { FileClient } from "@src/module/repository/file-client";
import { DateUtil } from "@src/shared/util/date.util";

export class GithubFileReader implements FileReader {
	private static readonly PATH_ROOT = "kaio-ken";

	private cachedMetadata: Metadata | null = null;

	constructor(private readonly fileClient: FileClient) {}

	async findMetadata(): Promise<Metadata | null> {
		if (this.cachedMetadata) return this.cachedMetadata;

		const file = await this.fileClient.find(Metadata.PATH);
		if (!file) return null;

		const metadata = MetadataYamlParser.parse(file.toString());
		this.cachedMetadata = metadata;

		return metadata;
	}

	async getMetadata(): Promise<Metadata> {
		if (this.cachedMetadata) return this.cachedMetadata;

		const file = await this.fileClient.get(Metadata.PATH);
		const metadata = MetadataYamlParser.parse(file.toString());
		this.cachedMetadata = metadata;

		return metadata;
	}

	async getPosts(): Promise<Posts> {
		const files = await this.fileClient.getFilesFromDirectory("posts");
		const postEntities: Array<PostEntity> = [];
		for (const file of files) {
			const buffer = await file.buffer();
			const parsedMarkdown = MarkdownParser.parseFromMarkdown(buffer.toString());

			const { frontMatter, content } = parsedMarkdown;

			const parsedPost = PostParser.parse(
				{
					title: frontMatter.title,
					uploadedAt: DateUtil.fromString(frontMatter.uploadedAt),
					url: frontMatter.url,
					language: frontMatter.language,
					content,
				},
				Number(file.path.split("/")[-1].split(".")[0]),
			);

			postEntities.push(parsedPost);
		}
		return Posts.create(postEntities);
	}

	async getPost(id: UniqueEntityId, language: Language): Promise<PostEntity> {
		const file = await this.fileClient.get(PostParser.getPath(language, id));
		const parsedMarkdown = MarkdownParser.parseFromMarkdown(file.toString());
		const { frontMatter, content } = parsedMarkdown;

		return PostParser.parse(
			{
				title: frontMatter.title,
				uploadedAt: DateUtil.fromString(frontMatter.uploadedAt),
				url: frontMatter.url,
				language: frontMatter.language,
				content,
			},
			id.toNumber(),
		);
	}

	async getPostByTranslation(translation: Translation): Promise<PostEntity> {
		return this.getPost(translation.id, translation.language);
	}

	async getPostsByTranslations(translations: Translation[]): Promise<PostEntity[]> {
		const postPromises = translations.map((translation) => this.getPost(translation.id, translation.language));
		return Promise.all(postPromises);
	}

	async findSitemap(): Promise<Sitemap | null> {
		const exists = await this.fileClient.exists(Sitemap.PATH);
		if (!exists) return null;

		const file = await this.fileClient.get(Sitemap.PATH);
		return SitemapXmlParser.fromString(file.toString());
	}
	async getSitemap(): Promise<Sitemap> {
		const exists = await this.fileClient.exists(Sitemap.PATH);
		if (!exists) throw new Error("sitemap이 없습니다.");

		const file = await this.fileClient.get(Sitemap.PATH);
		return SitemapXmlParser.fromString(file.toString());
	}

	async readTranslations(language: Language): Promise<Translations> {
		const files = await this.fileClient.getFilesFromDirectory(
			path.join(GithubFileReader.PATH_ROOT, language.toString()),
		);
		const translates = await Promise.all(
			files.map(async (file): Promise<Translation> => {
				const buffer = await file.buffer();
				const parsedMarkdown = MarkdownParser.parseFromMarkdown(buffer.toString());

				const { frontMatter, content } = parsedMarkdown;
				const id = file.filename.split(".")[0];

				return PostParser.parseToTranslation(
					{ ...frontMatter, content } as PostParserProps,
					UniqueEntityId.create(Number(id)),
				);
			}),
		);

		return Translations.create(translates);
	}

	async getLastPostId(): Promise<number> {
		const files = await this.fileClient.getFilesFromDirectory(PostEntity.BASE_PATH);
		const rawIds = files.map((file) => Number(file.name));

		return Math.max(...rawIds);
	}

	async existPostByTranslation(translation: Translation): Promise<boolean> {
		const filePath = path.join(
			GithubFileReader.PATH_ROOT,
			translation.language.toString(),
			`${translation.id.toString()}.md`,
		);
		return this.fileClient.exists(filePath);
	}
}
