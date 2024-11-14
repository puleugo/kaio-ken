import {PostMother} from "../fixture/PostMother";
import {HrefTagEnum} from "../../src/type";
import {Posts} from "../../src/domain/posts";

describe('Posts Unit Test', () => {
	it('특정 언어의 번역본이 없는 게시글을 필터링한다.', () => {
		const posts = new Posts(PostMother.createMany(3, {
			language: HrefTagEnum.Korean,
		}))
		const filteredPosts = posts.filterNotTranslatedBy(HrefTagEnum.English);
		expect(filteredPosts).toHaveLength(3);
	})
})
