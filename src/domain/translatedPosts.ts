import {HrefTagEnum} from "../type";
import {PostEntity} from "./postEntity";

interface TranslatedPostWithLanguage {
	[language: string]: {
		title: string;
		url: string;
	}
}

export class TranslatedPosts {
	constructor(private readonly translatedPosts : PostEntity[]) {
	}

	get getLanguages(): HrefTagEnum[] {
		return this.translatedPosts.map(post => post.language);
	}

	get metadata(): TranslatedPostWithLanguage {
		const result: TranslatedPostWithLanguage = {}
		this.translatedPosts.forEach(post => {
			result[post.language] =
				{
					title: post.title,
					url: post.originUrl
				}
		});
		return result;
	}
}


