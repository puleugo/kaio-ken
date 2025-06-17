import type { BlogEntity } from "../domain/blog.entity";
import type { Translations } from "../domain/translations";

export interface TranslationUploader {
	uploadMany(subscriber: BlogEntity, translations: Translations): Promise<void>;
}
