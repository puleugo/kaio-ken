import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { PostUrl } from "@src/module/domain/post-url";
import { PostEntity } from "@src/module/domain/post.entity";
import { TranslationMap } from "@src/module/domain/translation-map";

describe("PostEntity", () => {
	beforeAll(() => {
		AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY);
	});

	const createPostProps = () => ({
		title: PostTitle.from("Test Post").getValue(),
		content: PostContent.from("Test Content").getValue(),
		uploadedAt: PostUploadedDate.from(new Date()).getValue(),
		url: PostUrl.from("https://example.com/post").getValue(),
		language: Language.from("en").getValue(),
	});

	it("should create a post with required properties", () => {
		const props = createPostProps();
		const result = PostEntity.create(props);

		expect(result.isSucceed).toBe(true);
		const post = result.getValue();
		expect(post.title).toBe(props.title);
		expect(post.content).toBe(props.content);
		expect(post.uploadedAt).toBe(props.uploadedAt);
		expect(post.url).toBe(props.url);
		expect(post.language).toBe(props.language);
		expect(post.translationMap).toBeInstanceOf(TranslationMap);
		expect(post.translationMap.size).toBe(0);
	});

	it("should create a post with translations", () => {
		const props = createPostProps();
		const translations = new TranslationMap();
		const result = PostEntity.create({ ...props, translations });

		expect(result.isSucceed).toBe(true);
		const post = result.getValue();
		expect(post.translationMap).toBe(translations);
	});

	it("should create a post with a specific id", () => {
		const props = createPostProps();
		const id = UniqueEntityId.create(1);
		const result = PostEntity.create(props, id);

		expect(result.isSucceed).toBe(true);
		const post = result.getValue();
		expect(post.id).toBe(id);
	});

	it("should fail when required properties are missing", () => {
		const props = createPostProps();
		const result = PostEntity.create({ ...props, title: undefined as unknown as PostTitle });

		expect(result.isFailed).toBe(true);
		expect(result.getReason()).toContain("title");
	});

	it("should have correct entity key and base path", () => {
		expect(PostEntity.ENTITY_KEY).toBe("PostEntity");
		expect(PostEntity.BASE_PATH).toBe("kaio-ken/posts");
	});

	it("should maintain property values after creation", () => {
		const props = createPostProps();
		const result = PostEntity.create(props);
		const post = result.getValue();

		expect(post.title).toBe(props.title);
		expect(post.content).toBe(props.content);
		expect(post.uploadedAt).toBe(props.uploadedAt);
		expect(post.url).toBe(props.url);
		expect(post.language).toBe(props.language);
	});

	it("should create a post with auto-increment id when not specified", () => {
		const props = createPostProps();
		const result = PostEntity.create(props);

		expect(result.isSucceed).toBe(true);
		const post = result.getValue();
		expect(post.id).toBeInstanceOf(UniqueEntityId);
	});
});
