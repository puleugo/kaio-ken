import {BlogEntity, BlogInterface} from "../../src/domain/blog.entity";
import {fakerKO} from "@faker-js/faker";
import {BlogPlatformEnum, HrefTagEnum} from "../../src/type";

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
		const subscriberBlogs: BlogEntity[] = Array.from({length: length-1}, () => BlogMother.create({type: 'SUBSCRIBER'}));
		return [publisherBlog, ...subscriberBlogs];
	}

	static createManyWithoutPublisher(length = fakerKO.number.int({min: 1, max: 10})): BlogEntity[] {
		return Array.from({length}, () => BlogMother.create({type: 'SUBSCRIBER'}));
	}
}
