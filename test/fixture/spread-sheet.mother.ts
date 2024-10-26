import {fakerKO} from "@faker-js/faker";
import {DateUtil} from "../../src/util/util/DateUtil";
import {Metadata} from "../../src/domain/metadata";

export class SpreadSheetMother {

	static get realPublisherBlogRow(): string[] {
		return ['푸르고의 개발 블로그', '0',  DateUtil.minFormatYYYYMMDD, 'https://puleugo.tistory.com/rss', 'Tistory', 'PUBLISHER'];
	}
	static get publisherBlogRow(): string[] {
		return ['푸르고의 개발 블로그', '0',  DateUtil.minFormatYYYYMMDD, 'https://puleugo.tistory.com/rss', 'Tistory', 'PUBLISHER'];
	}

	static get subscribeBlogRow(): string[] {
		return [fakerKO.word.words(), '0', DateUtil.minFormatYYYYMMDD, '', 'Tistory', 'SUBSCRIBER'];
	}

	static blogRows(): string[][] {
		return [
			this.publisherBlogRow,
			this.subscribeBlogRow,
			this.subscribeBlogRow,
		]
	}

	static blogRowsByMetadata(metadata: Metadata): string[][] {
		return metadata.jsonObject.blogs.map(blog => {
			return [
				blog.title,
				blog.lastPublishedIndex.toString(),
				blog.lastPublishedAt,
				blog.rssUrl,
				blog.platform,
				blog.type
			]
		})
	}
}
