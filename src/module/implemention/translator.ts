import type { BlogPublishedId } from "@src/module/domain/blog-published-id";
import type { Language } from "@src/module/domain/language";
import type { Translations } from "@src/module/domain/translations";

export interface Translator {
	translatePosts(props: { language: Language; lastPublishedId: BlogPublishedId }[]): Promise<Translations>;
}
