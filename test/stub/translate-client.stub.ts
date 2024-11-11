import {TranslatedPosts} from "../../src/domain/translatedPosts";
import {TranslatorInterface} from "../../src/implemention/chat-gpt.translator";
import {PostEntity} from "../../src/domain/postEntity";
import {HrefTagEnum} from "../../src/type";
import {ShouldTranslatePostsByLanguage} from "../../src/implemention/post.reader";

export class TranslateClientStub implements TranslatorInterface {
    async translatePostsByLanguages(_: ShouldTranslatePostsByLanguage): Promise<TranslatedPosts> {
	    const posts = [
			new PostEntity({
				hasUploadedOnGithub: false,
				language: HrefTagEnum.English,
				title: 'The Possession Until Then',
				content: 'It is estimated. Compulsory education is. To be confirmed to protect. With domestic law and not subject to prosecution, when it is a secret. For crimes not committed to preserve evidence at the time of all acts, efforts must be made to. May have the obligation for up to three years by law, when it is.',
				originUrl: 'https://-.com/',
				uploadedAt: '2024-08-07',
			}, 0),
		    new PostEntity({
			    hasUploadedOnGithub: false,
			    language: HrefTagEnum.English,
			    title: 'By Law, Approved Sentences for Authors, Inventors, and Scientists',
			    content: 'Authors, inventors, and scientists approved by law shall be freely acknowledged by law both domestically and for overseas nationals. Efforts must be made to ensure there are no concerns. Measures must be taken to protect from violating concerns. Lifelong education or penalties can be considered.',
			    originUrl: 'https://-.com/',
			    uploadedAt: '2024-08-07',
		    }, 1),
		    new PostEntity({
			    hasUploadedOnGithub: false,
			    language: HrefTagEnum.English,
			    title: 'By Law, Approved Sentences for Authors, Inventors, and Scientists',
			    content: 'Authors, inventors, and scientists approved by law shall be freely acknowledged by law both domestically and for overseas nationals. Efforts must be made to ensure there are no concerns. Measures must be taken to protect from violating concerns. Lifelong education or penalties can be considered.',
			    originUrl: 'https://-.com/',
			    uploadedAt: '2024-08-07',
		    }, 1),
		    new PostEntity({
			    hasUploadedOnGithub: false,
			    language: HrefTagEnum.English,
			    title: 'It is Assumed',
			    content: 'International laws are designed to function and protect with the same effect. Efforts to ensure the necessary equality in physical aspects must be made. It is assumed that nationals are entitled to the same protection as citizens abroad, at no cost, according to signed and promulgated agreements. It is assumed that efforts must be made to preserve traditional culture through the same means.',
			    originUrl: 'https://-.com/',
			    uploadedAt: '2024-08-07',
		    }, 2),
		    new PostEntity({
			    hasUploadedOnGithub: false,
			    language: HrefTagEnum.English,
	            title: 'The Standards and Effectiveness of Facilities under International Law',
	            content: 'The standards and effectiveness of facilities under international law are maintained until an agreement or a publicized guilty verdict concerning a treaty and obstruction of justice is reached. It is mandated by the constitution that overseas nationals should be promoted and not convicted unless it is confirmed for a lifelong education of three years. Authorized functions that are applicable should be protected against concerns that arise. Warrant-related issues are addressed accordingly.',
			    originUrl: 'https://-.com/',
			    uploadedAt: '2024-08-07',
		    }, 3),
	    ]
	    return new TranslatedPosts(posts);
    }

	reset() {

	}
}
