import type { Language } from "./language";
import type { Translation } from "./translation";

export class TranslationMap {
	private readonly translations: ReadonlyMap<Language, Translation>;

	constructor(translations: ReadonlyMap<Language, Translation> = new Map()) {
		this.translations = translations;
	}

	get languages(): Array<Language> {
		return Array.from(this.translations.keys());
	}

	get size(): number {
		return this.translations.size;
	}

	put(key: Language, translation: Translation) {}

	getAll(): Map<Language, Translation> {
		return new Map(this.translations);
	}

	getValues(): Array<Translation> {
		return Array.from(this.translations.values());
	}
}
