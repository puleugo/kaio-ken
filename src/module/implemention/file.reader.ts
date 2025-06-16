import type { UniqueEntityId } from "../../core/unique-identifier";
import type { Language } from "../domain/language";
import type { Metadata } from "../domain/metadata";
import type { PostEntity } from "../domain/post.entity";
import type { Posts } from "../domain/posts";
import type { Sitemap } from "../domain/sitemap";
import type { Translation } from "../domain/translation";
import type { Translations } from "../domain/translations";

export interface FileReader {
	findMetadata(): Promise<Metadata | null>;
	getMetadata(): Promise<Metadata>;

	findSitemap(): Promise<Sitemap | null>;
	getSitemap(): Promise<Sitemap>;

	getPosts(): Promise<Posts>;
	getPost(id: UniqueEntityId, language: Language): Promise<PostEntity>;
	getPostByTranslation(translation: Translation): Promise<PostEntity>;
	getPostsByTranslations(translations: Translation[]): Promise<PostEntity[]>;
	readTranslations(language: Language): Promise<Translations>;

	existPostByTranslation(translation: Translation): Promise<boolean>;
}
