import {Blogs} from "../../src/domain/blogs";
import {BlogMother} from "../fixture/blog.mother";

describe('Blogs Unit Test', () => {
	it('Publisher 블로그는 하나만 존재할 수 있다.', () => {
		const rawBlogs = [BlogMother.create({type: 'PUBLISHER'}), BlogMother.create({type: 'PUBLISHER'})];
		expect(() => new Blogs(rawBlogs)).toThrow();
	})
	it('UnSubscriber는 변환하지 않는다.', () => {
		const blogs = new Blogs([BlogMother.create({type: 'UNSUBSCRIBER'})]);
		expect(blogs.length).toBe(0);
	})
})
