import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { PostUrl } from "@src/module/domain/post-url";
import { PostEntity } from "@src/module/domain/post.entity";
import { Posts } from "@src/module/domain/posts";
import { Translation } from "@src/module/domain/translation";
import { TranslationMap } from "@src/module/domain/translation-map";

export namespace PostMother {
	export function create(props: { id: number; language: Language }): PostEntity {
		const title = PostTitle.from("Test Post").getValue();
		const content = PostContent.from("Test Content").getValue();
		const url = PostUrl.from("https://example.com/post").getValue();
		const uploadedAt = PostUploadedDate.from(new Date()).getValue();

		return PostEntity.create(
			{
				title,
				content,
				url,
				uploadedAt,
				language: props.language,
			},
			UniqueEntityId.create(props.id),
		).getValue();
	}

	export function createWithTranslation(translation: Translation): PostEntity {
		const title = PostTitle.from("Test Post").getValue();
		const content = PostContent.from("Test Content").getValue();
		const url = PostUrl.from("https://example.com/post").getValue();
		const uploadedAt = PostUploadedDate.from(new Date()).getValue();
		const language = Language.from("en").getValue();
		const translations = new Map<Language, Translation>();
		translations.set(translation.language, translation);

		return PostEntity.create({
			title,
			content,
			url,
			uploadedAt,
			language,
			translations: new TranslationMap(translations),
		}).getValue();
	}

	export function createMany(count = 1): PostEntity[] {
		return Array.from({ length: count }, () =>
			create({ id: AutoIncrementManager.instance.getNextId(PostEntity.ENTITY_KEY), language: Language.values.English }),
		);
	}

	export function createManyWithTranslatedPosts(count = 1, translatedCount = 1): PostEntity[] {
		const posts = createMany(count);
		const translatedPosts = posts.slice(0, translatedCount).map((post) => {
			const translation = Translation.create({
				postId: post.id,
				title: PostTitle.from("Translated Title").getValue(),
				content: PostContent.from("Translated Content").getValue(),
				language: post.language,
				uploadedAt: null,
				url: null,
			}).getValue();
			return createWithTranslation(translation);
		});
		return [...translatedPosts, ...posts.slice(translatedCount)];
	}

	export function createPosts(posts: PostEntity[]): Posts {
		return Posts.create(posts);
	}
}
