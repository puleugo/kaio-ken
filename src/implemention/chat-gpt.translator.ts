import {Posts} from "../domain/posts";
import {AiRepositoryInterface, chatGptTranslatorRepository} from "../repository/translator.repository";
import {z}from "zod";
import {TranslatedPosts} from "../domain/translatedPosts";
import {HrefTagEnum, isHrefTagEnum} from "../type";
import {ShouldTranslatePostsByLanguage} from "./post.reader";
import {PostEntity} from "../domain/postEntity";
import {githubReader, GithubReaderInterface} from "./github.reader";

export interface TranslatorInterface {
	  translatePostsByLanguages(targetLanguageByPosts: ShouldTranslatePostsByLanguage): Promise<TranslatedPosts>;
}

export class ChatGptTranslator implements TranslatorInterface{
	constructor(private readonly aiClient: AiRepositoryInterface, private readonly githubReader: GithubReaderInterface) {
	}

	async translatePostsByLanguages(targetLanguageByPosts: ShouldTranslatePostsByLanguage): Promise<TranslatedPosts> {
		const translatedPosts = await Promise.all(Object.entries(targetLanguageByPosts).map(([language, posts]) => {
			if (!isHrefTagEnum(language)) {
				throw new Error(`올바르지 않은 언어입니다: ${language}`);
			}
			if(posts.isEmpty) {
				return
			}

			return this.translatePosts(posts, language);
		}))
		translatedPosts.filter(posts => posts !== undefined);

		return new TranslatedPosts(translatedPosts.flat().filter(posts => posts !== undefined));
    }

	private async translatePosts(posts: Posts, targetLanguage: HrefTagEnum): Promise<PostEntity[]> {
		const existPosts = await this.githubReader.readPosts(targetLanguage, new Set(posts.indexes));

		const expectTranslatedResult = z.object({
			translatedTitle: z.string(),
			translatedContent: z.string()
		})

		return Promise.all(posts.toEntities.map(async (post): Promise<PostEntity> => {
			if(existPosts.hasPost(post)) {
				return existPosts.getById(post.index);
			}

			const result = await this.aiClient.chat(
				`You are a helpful assistant that translates blog posts from ${post.language} to ${targetLanguage}.\n Here is Rule.`+
				`1. Don't shorten the content\n`+
				`2. Don't change the meaning of the content\n`+
				`3. Don't Remove Markdown Image URL in the content\n`+
				`4. Add anything that is lacking in the description`,
				`# ${post.title}\n ${post.content}`,
				{zod: expectTranslatedResult, name: 'expectTranslatedResult'}
			)
			post.updateTranslate({
				title: result.translatedTitle,
				content: result.translatedContent,
				language: targetLanguage
			})
			return post;
		}));
	}
}

export const chatGptTranslator = new ChatGptTranslator(chatGptTranslatorRepository, githubReader);
