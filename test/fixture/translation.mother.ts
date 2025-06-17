import { faker } from "@faker-js/faker";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";
import { PostContent } from "@src/module/domain/post-content";
import { PostTitle } from "@src/module/domain/post-title";
import { Translation } from "@src/module/domain/translation";
import { ValueObjectMother } from "./value-object.mother";

export namespace TranslationMother {
	export function create(): Translation {
		return Translation.create({
			postId: ValueObjectMother.createRandomIncrementId(BlogEntity.ENTITY_KEY),
			title: PostTitle.from(faker.lorem.sentence(5)).getValue(),
			language: Language.from(faker.helpers.arrayElement(["en", "fr", "es", "de", "ja"])).getValue(),
			content: PostContent.from(faker.lorem.paragraphs(3)).getValue(),
			uploadedAt: null,
			url: null,
		}).getValue();
	}
}
