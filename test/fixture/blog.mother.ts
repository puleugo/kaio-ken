import {BlogEntity, BlogInterface} from "../../src/domain/blog.entity";
import {fakerKO} from "@faker-js/faker";
import {BlogPlatformEnum, HrefTagEnum} from "../../src/type";
import {DateUtil} from "../../src/util/util/DateUtil";

export class BlogMother {
	static create(props: Partial<BlogInterface>): BlogEntity {
		return new BlogEntity(Object.assign( {
			title: fakerKO.lorem.sentence(),
			platform: fakerKO.helpers.enumValue(BlogPlatformEnum),
			language: fakerKO.helpers.enumValue(HrefTagEnum),
			rssUrl: fakerKO.internet.url(),
			lastPublishedIndex: fakerKO.number.int({min: 0, max: 100}),
			lastPublishedAt: fakerKO.date.recent(),
			type: fakerKO.helpers.arrayElement(['PUBLISHER', 'SUBSCRIBER', 'UNSUBSCRIBER'])
		}, props));
	}

	static createMany(length = fakerKO.number.int({min: 1, max: 10})): BlogEntity[] {
		const publisherBlog = BlogMother.create({type: 'PUBLISHER'});
		const subscriberBlogs: BlogEntity[] = Array.from({length: length-1}, () => BlogMother.create({type: 'SUBSCRIBER', lastPublishedIndex: fakerKO.number.int({min: 0, max: publisherBlog.lastPublishedId})}));
		return [publisherBlog, ...subscriberBlogs];
	}

	static createManyWithRealPublisher(length = fakerKO.number.int({min: 1, max: 10})): BlogEntity[] {
		const publisherBlog = BlogMother.createRealPublisher();
		const subscriberBlogs: BlogEntity[] = Array.from({length: length-1}, () => BlogMother.create({type: 'SUBSCRIBER', language: HrefTagEnum.Korean, lastPublishedIndex: fakerKO.number.int({min: 0, max: publisherBlog.lastPublishedId})}));
		return [publisherBlog, ...subscriberBlogs];
	}

	static createManyWithoutPublisher(length = fakerKO.number.int({min: 1, max: 10})): BlogEntity[] {
		return Array.from({length}, () => BlogMother.create({type: 'SUBSCRIBER'}));
	}

	static createRealPublisher() {
		return new BlogEntity({
			title: '푸르고의 개발 블로그',
			platform: BlogPlatformEnum.Tistory,
			language: HrefTagEnum.Korean,
			rssUrl: 'https://puleugo.tistory.com/rss',
			lastPublishedIndex: fakerKO.number.int({min: 0, max: 100}),
			lastPublishedAt: DateUtil.min,
			type: "PUBLISHER"
		});
	}
}
