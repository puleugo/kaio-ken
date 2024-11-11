import {PostMother} from "../fixture/PostMother";
import {chatGptTranslator} from "../../src/implemention/chat-gpt.translator";
import {Posts} from "../../src/domain/posts";
import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {HrefTagEnum} from "../../src/type";
import 'dotenv/config';

describe('ChatGptTranslator Integration Test', () => {
	jest.setTimeout(1000 * 60 * 10);
	  it('should translate post', async () => {
		  // given
		  const posts = new Posts(PostMother.createManyWithTranslatedPosts());
		  const targetLanguage = HrefTagEnum.English;

		  // when
		  const translatedPosts = await chatGptTranslator.translatePostsByLanguages({[targetLanguage]: posts});

		  // then
		  expect(translatedPosts).toBeInstanceOf(TranslatedPosts);
		  expect(translatedPosts.languages).toEqual([HrefTagEnum.English]);
		  expect(translatedPosts.getPostByLanguage(targetLanguage)).toBeInstanceOf(Posts);
		  expect(translatedPosts.getPostByLanguage(targetLanguage)).toHaveLength(posts.length);
	  });
})
