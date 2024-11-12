import {PostMother} from "../fixture/PostMother";
import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {HrefTagEnum} from "../../src/type";

describe('TranslatedPosts Unit Test', () => {
	describe('여집합의 게시글을 조회한다.', () => {
		it('여집합을 검증', () => {
			// given
			const posts = PostMother.createMany(3, {language: HrefTagEnum.Korean});
			const translatedPosts = new TranslatedPosts(posts);

			// when
			const expected = new TranslatedPosts([posts[2]]);
			const complement = translatedPosts.getComplement(new TranslatedPosts(posts.slice(0, 2)));

			// then
			expect(complement.postsWithLanguage).toStrictEqual(expected.postsWithLanguage);
		})

		it('빈 게시글을 통해 여집합 검증', () => {
			// given
			const posts = PostMother.createMany(3, {language: HrefTagEnum.Korean});
			const translatedPosts = new TranslatedPosts(posts);

			// when
			const complement = translatedPosts.getComplement(new TranslatedPosts([]));

			// then
			expect(complement.values).toHaveLength(3);
			expect(complement.getPostByLanguage(HrefTagEnum.Korean)).toHaveLength(3);
		})
	})


})
