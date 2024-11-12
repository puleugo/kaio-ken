import {PostEntity, PostInterface, RawPostInterface} from "../../src/domain/postEntity";
import {HrefTagEnum} from "../../src/type";
import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {fakerKO} from "@faker-js/faker";
import {DateUtil} from "../../src/util/util/DateUtil";

export class PostMother {
	static create(props?: Partial<RawPostInterface>): PostEntity {
		return new PostEntity(Object.assign({
			title: fakerKO.lorem.sentence(),
			content: fakerKO.lorem.paragraph(),
			uploadedAt: DateUtil.formatYYYYMMDD(fakerKO.date.past()),
			hasUploadedOnGithub: false,
			originUrl: fakerKO.internet.url(),
			language: fakerKO.helpers.enumValue(HrefTagEnum),
		}, props), props?.index);
	};

	static createMany(time: number = 3, props?: Partial<RawPostInterface>): PostEntity[] {
		if (props?.index != undefined && props.index >= 0) {
			return Array.from({length: time}, (_, index) => PostMother.create(props)).sort((a, b) => a.uploadedAt < b.uploadedAt ? -1 : 1).map((post, index) => {
				post.index = props.index + index; return post;
			})
		}
		return Array.from({length: time}, () => PostMother.create(props)).sort((a, b) => a.uploadedAt < b.uploadedAt ? -1 : 1);
	}

	static createWithTranslatedPosts(props: Partial<RawPostInterface>, translatedCount: number = 3): PostEntity {
		const post = PostMother.create({...props, language: HrefTagEnum.Korean});
		post.translatedPosts = new TranslatedPosts(PostMother.createMany(translatedCount));
		return post;
	}

	static createManyWithTranslatedPosts(count: number = 4, translatedCount=5): PostEntity[] {
		return Array.from({length: count}, (_, index) => PostMother.createWithTranslatedPosts({index}, translatedCount));
	}
}
