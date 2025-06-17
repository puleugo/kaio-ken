import { BlogPlatform } from "@src/module/domain/blog-platform";
import { BlogPublishedId } from "@src/module/domain/blog-published-id";
import { BlogTitle } from "@src/module/domain/blog-title";
import { BlogType } from "@src/module/domain/blog-type";
import { BlogUrl } from "@src/module/domain/blog-url";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Language } from "@src/module/domain/language";

export namespace BlogMother {
	export function createPublisher(language?: Language, lastPublishedId = 0): BlogEntity {
		const platform = BlogPlatform.from("tistory").getValue();
		const title = BlogTitle.create("Publisher Blog").getValue();
		const url = BlogUrl.from("https://example.com").getValue();
		const rssUrl = BlogUrl.from("https://example.com/rss").getValue();

		return BlogEntity.create({
			platform,
			language: language ?? Language.from("en").getValue(),
			title,
			url,
			rssUrl,
			type: BlogType.PUBLISHER,
			lastPublishedId: BlogPublishedId.from(lastPublishedId).getValue(),
		}).getValue();
	}

	export function createSubscriber(language?: Language, lastPublishedId = 0): BlogEntity {
		const platform = BlogPlatform.from("medium").getValue();
		const title = BlogTitle.create("Subscriber Blog").getValue();
		const url = BlogUrl.from("https://example.com").getValue();
		const rssUrl = BlogUrl.from("https://example.com/rss").getValue();

		return BlogEntity.create({
			platform,
			language: language ?? Language.from("en").getValue(),
			title,
			url,
			rssUrl,
			type: BlogType.SUBSCRIBER,
			lastPublishedId: BlogPublishedId.from(lastPublishedId).getValue(),
		}).getValue();
	}

	export function createUnSubscriber(language?: Language, lastPublishedId = 0): BlogEntity {
		const platform = BlogPlatform.from("medium").getValue();
		const title = BlogTitle.create("UnSubscriber Blog").getValue();
		const url = BlogUrl.from("https://example.com").getValue();
		const rssUrl = BlogUrl.from("https://example.com/rss").getValue();

		return BlogEntity.create({
			platform,
			language: language ?? Language.from("en").getValue(),
			title,
			url,
			rssUrl,
			type: BlogType.UNSUBSCRIBER,
			lastPublishedId: BlogPublishedId.from(lastPublishedId).getValue(),
		}).getValue();
	}
}
