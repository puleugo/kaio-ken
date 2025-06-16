import type { Metadata } from "../domain/metadata";
import type { Posts } from "../domain/posts";
import type { Sitemap } from "../domain/sitemap";
import type { Translations } from "../domain/translations";
import type { UploadableFileDto } from "../dto/uploadable-file.dto";

export interface FileUploader {
	uploadPosts(posts: Posts): Promise<void>;

	updateSitemap(sitemap: Sitemap): Promise<void>;

	updateMetadata(metadata: Metadata): Promise<void>;

	uploadFile(file: UploadableFileDto): Promise<void>;

	uploadTranslations(translations: Translations): Promise<void>;
}
