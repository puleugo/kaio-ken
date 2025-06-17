import type { UniqueEntityId } from "../../core/unique-identifier";
import type { Translation } from "./translation";

export class Translations {
	private readonly translations: ReadonlyArray<Translation>;

	get isEmpty(): boolean {
		return this.translations.length === 0;
	}

	private constructor(translations: ReadonlyArray<Translation> = []) {
		this.translations = translations;
	}

	public static create(translations: ReadonlyArray<Translation> = []): Translations {
		return new Translations(translations);
	}

	getAll(): Array<Translation> {
		return [...this.translations];
	}

	getLast(): Translation {
		if (this.isEmpty) throw new Error("No translations found");
		return this.translations[this.translations.length - 1];
	}

	getNewerThan(lastPublishedId: UniqueEntityId) {
		return new Translations(
			this.translations.filter((translation) => {
				const postId = translation.id.toNumber();
				return postId >= lastPublishedId.toNumber();
			}),
		);
	}
}
