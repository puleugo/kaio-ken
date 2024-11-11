import {PostMother} from "../fixture/PostMother";
import {TranslatedPosts} from "../../src/domain/translatedPosts";

describe('TranslatedPosts Unit Test', () => {
	it('여집합을 게시글을 조회합니다', () => {
		// given
		const posts = PostMother.createMany(3);
		const translatedPosts = new TranslatedPosts(posts);

		// when
		const expected = new TranslatedPosts([posts[2]]);
		const complement = translatedPosts.getComplement(new TranslatedPosts(posts.slice(0, 2)));

		// then
		expect(complement.postsWithLanguage).toStrictEqual(expected.postsWithLanguage);
	})
})
