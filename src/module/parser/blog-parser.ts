import { NullGuard } from "@src/core/null-guard";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogPublishedId } from "@src/module/domain/blog-published-id";
import { BlogTitle } from "@src/module/domain/blog-title";
import type { BlogType } from "@src/module/domain/blog-type";
import { BlogUrl } from "@src/module/domain/blog-url";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";

interface BlogParserProps {
	title: string;
	url: string;
	rssUrl?: string; // exists if blog type is publisher
	language: string;
	platform: string;
	type: BlogType;
	lastPublishedId?: number;
}

export namespace BlogParser {
	export function parse(props: BlogParserProps, id?: number): BlogEntity {
		const title = NullGuard.getOrThrow(props?.title, "title");
		const url = NullGuard.getOrThrow(props?.url, "url");
		const language = NullGuard.getOrThrow(props?.language, "language");
		const platform = NullGuard.getOrThrow(props?.platform, "language");

		const titleOrError = BlogTitle.create(title);
		if (titleOrError.isFailed) throw new Error(titleOrError.getReason());

		const urlOrError = BlogUrl.from(url);
		if (urlOrError.isFailed) throw new Error(urlOrError.getReason());

		const languageOrError = Language.from(language);
		if (languageOrError.isFailed) throw new Error(languageOrError.getReason());

		const platformOrError = BlogPlatform.from(platform);
		if (platformOrError.isFailed) throw new Error(platformOrError.getReason());

		let rssUrlOrUndefined: BlogUrl | undefined = undefined;
		if (props?.rssUrl) {
			const blogUrlOrError = BlogUrl.from(props.rssUrl);
			if (blogUrlOrError.isFailed) throw new Error(blogUrlOrError.getReason());
			rssUrlOrUndefined = blogUrlOrError.getValue();
		}

		const blogOrError = BlogEntity.create(
			{
				title: titleOrError.getValue(),
				url: urlOrError.getValue(),
				rssUrl: rssUrlOrUndefined,
				language: languageOrError.getValue(),
				platform: platformOrError.getValue(),
				type: props.type,
				lastPublishedId: BlogPublishedId.from(props.lastPublishedId ?? 0).getValue(),
			},
			id ? UniqueEntityId.create(id) : undefined,
		);

		if (blogOrError.isFailed) throw new Error(blogOrError.getReason());
		return blogOrError.getValue();
	}
}
