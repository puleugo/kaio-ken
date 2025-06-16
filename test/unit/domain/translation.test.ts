import { UniqueEntityId } from "@src/core/unique-identifier";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { Translation } from "@src/module/domain/translation";

describe("Translation", () => {
	const createValidProps = () => ({
		postId: UniqueEntityId.generate({ strategy: "uuid", props: { version: "4" } }),
		title: PostTitle.from("Test Title").getValue(),
		language: Language.from("en").getValue(),
		content: PostContent.from("Test Content").getValue(),
		uploadedAt: PostUploadedDate.from(new Date()).getValue(),
		url: null,
	});

	it("should create a valid translation", () => {
		const props = createValidProps();
		const result = Translation.create(props);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().id).toBe(props.postId);
		expect(result.getValue().title).toBe(props.title);
		expect(result.getValue().language).toBe(props.language);
		expect(result.getValue().content).toBe(props.content);
		expect(result.getValue().uploadedAt).toBe(props.uploadedAt);
		expect(result.getValue().url).toBeNull();
	});

	it("should handle different languages", () => {
		const languages = ["en", "ja", "ko-KR", "zh-CN"];
		for (const lang of languages) {
			const props = createValidProps();
			props.language = Language.from(lang).getValue();
			const result = Translation.create(props);
			expect(result.isSucceed).toBe(true);
			expect(result.getValue().language.toString()).toBe(lang);
		}
	});
});
