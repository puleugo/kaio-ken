import { UniqueEntityId } from "@src/core/unique-identifier";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { Translation } from "@src/module/domain/translation";
import { Translations } from "@src/module/domain/translations";

describe("Translations", () => {
	const createTranslation = (id: number) => {
		return Translation.create({
			postId: UniqueEntityId.create(id),
			title: PostTitle.from("Test Title").getValue(),
			language: Language.from("en").getValue(),
			content: PostContent.from("Test Content").getValue(),
			uploadedAt: PostUploadedDate.from(new Date()).getValue(),
			url: null,
		}).getValue();
	};

	it("should create empty translations", () => {
		const translations = Translations.create();
		expect(translations.isEmpty).toBe(true);
		expect(translations.getAll()).toHaveLength(0);
	});

	it("should create translations with initial values", () => {
		const translation1 = createTranslation(1);
		const translation2 = createTranslation(2);
		const translations = Translations.create([translation1, translation2]);
		expect(translations.isEmpty).toBe(false);
		expect(translations.getAll()).toHaveLength(2);
		expect(translations.getAll()).toContain(translation1);
		expect(translations.getAll()).toContain(translation2);
	});

	it("should filter translations by start id", () => {
		const translation1 = createTranslation(1);
		const translation2 = createTranslation(2);
		const translation3 = createTranslation(3);
		const translations = Translations.create([translation1, translation2, translation3]);

		const filtered = translations.getNewerThan(UniqueEntityId.create(2));
		expect(filtered.getAll()).toHaveLength(2);
		expect(filtered.getAll()).toContain(translation2);
		expect(filtered.getAll()).toContain(translation3);
	});

	it("should get last translation", () => {
		const translation1 = createTranslation(1);
		const translation2 = createTranslation(2);
		const translations = Translations.create([translation1, translation2]);
		expect(translations.getLast()).toBe(translation2);
	});

	it("should throw error when getting last translation from empty list", () => {
		const translations = Translations.create();
		expect(() => translations.getLast()).toThrow("No translations found");
	});
});
