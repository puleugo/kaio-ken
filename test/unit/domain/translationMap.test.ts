import { UniqueEntityId } from "@src/core/unique-identifier";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { Translation } from "@src/module/domain/translation";
import { TranslationMap } from "@src/module/domain/translation-map";

describe("TranslationMap", () => {
	const createTranslation = (lang: string) => {
		const language = Language.from(lang).getValue();
		return Translation.create({
			postId: UniqueEntityId.generate({ strategy: "uuid", props: { version: "4" } }),
			title: PostTitle.from("Test Title").getValue(),
			language,
			content: PostContent.from("Test Content").getValue(),
			uploadedAt: PostUploadedDate.from(new Date()).getValue(),
			url: null,
		}).getValue();
	};

	it("should create an empty translation map", () => {
		const map = new TranslationMap();
		expect(map.size).toBe(0);
		expect(map.languages).toHaveLength(0);
		expect(map.getValues()).toHaveLength(0);
	});

	it("should create a translation map with initial values", () => {
		const translations = new Map<Language, Translation>();
		const enTranslation = createTranslation("en");
		const jaTranslation = createTranslation("ja");
		translations.set(enTranslation.language, enTranslation);
		translations.set(jaTranslation.language, jaTranslation);

		const map = new TranslationMap(translations);
		expect(map.size).toBe(2);
		expect(map.languages).toHaveLength(2);
		expect(map.getValues()).toHaveLength(2);
	});

	it("should get all translations", () => {
		const translations = new Map<Language, Translation>();
		const enTranslation = createTranslation("en");
		translations.set(enTranslation.language, enTranslation);

		const map = new TranslationMap(translations);
		const allTranslations = map.getAll();
		expect(allTranslations).toBeInstanceOf(Map);
		expect(allTranslations.size).toBe(1);
		expect(allTranslations.get(enTranslation.language)).toBe(enTranslation);
	});

	it("should get all translation values", () => {
		const translations = new Map<Language, Translation>();
		const enTranslation = createTranslation("en");
		const jaTranslation = createTranslation("ja");
		translations.set(enTranslation.language, enTranslation);
		translations.set(jaTranslation.language, jaTranslation);

		const map = new TranslationMap(translations);
		const values = map.getValues();
		expect(values).toHaveLength(2);
		expect(values).toContain(enTranslation);
		expect(values).toContain(jaTranslation);
	});

	it("should get all languages", () => {
		const translations = new Map<Language, Translation>();
		const enTranslation = createTranslation("en");
		const jaTranslation = createTranslation("ja");
		translations.set(enTranslation.language, enTranslation);
		translations.set(jaTranslation.language, jaTranslation);

		const map = new TranslationMap(translations);
		const languages = map.languages;
		expect(languages).toHaveLength(2);
		expect(languages).toContain(enTranslation.language);
		expect(languages).toContain(jaTranslation.language);
	});
});
