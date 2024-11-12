import {PostMother} from "../fixture/PostMother";
import {ChatGptTranslator, TranslatorInterface} from "../../src/implemention/chat-gpt.translator";
import {Posts} from "../../src/domain/posts";
import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {HrefTagEnum} from "../../src/type";
import 'dotenv/config';
import {AiRepositoryStub} from "../stub/ai-repository.stub";
import {GithubReaderStub} from "../stub/github-reader.stub";

describe('ChatGptTranslator Integration Test', () => {
	jest.setTimeout(1000 * 60 * 10);
	let chatGptTranslator: TranslatorInterface;
	let aiRepositoryStub: AiRepositoryStub;
	let githubReaderStub: GithubReaderStub;
	beforeAll(() => {
		aiRepositoryStub = new AiRepositoryStub();
		githubReaderStub = new GithubReaderStub();
		chatGptTranslator = new ChatGptTranslator(aiRepositoryStub, githubReaderStub);
	})

	afterEach(() => {
		aiRepositoryStub.reset();
		githubReaderStub.reset();
	})

	it('번역되어야 한다.', async () => {
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
	})

	it('번역 시 API를 호출한다.', async () => {
		// given
		const posts = new Posts(PostMother.createManyWithTranslatedPosts());
		const targetLanguage = HrefTagEnum.English;

		// when
		await chatGptTranslator.translatePostsByLanguages({[targetLanguage]: posts});

		// then
		expect(aiRepositoryStub.chatCount).toBe(posts.length);
	})

	it('이미 업로드 되어 있는 게시글은 API를 호출하지 않는다.', async () => {
		// given
		const posts = new Posts(PostMother.createManyWithTranslatedPosts());
		const targetLanguage = HrefTagEnum.English;
		githubReaderStub.uploadPosts(posts, targetLanguage);

		// when
		const translatedPosts = await chatGptTranslator.translatePostsByLanguages({[targetLanguage]: posts});

		// then
		expect(aiRepositoryStub.chatCount).toBe(0);
		expect(translatedPosts.values.length).toBe(posts.length);
	})

	it('빈 게시글은 번역 요청을하지 않는다.', async () => {
	  await chatGptTranslator.translatePostsByLanguages({[ HrefTagEnum.English]:  new Posts([])});
	  expect(aiRepositoryStub.chatCount).toBe(0);
	})
})
