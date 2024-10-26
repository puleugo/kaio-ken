import {SpreadSheetMother} from "../fixture/spread-sheet.mother";
import {BlogEntity} from "../../src/domain/blog.entity";

describe('Blog Unit Test', () => {
	it('SpreadSheet에서 읽어온 값으로 생성된다.', () => {
		const rawBlogs = SpreadSheetMother.publisherBlogRow;
		expect(() => new BlogEntity(rawBlogs)).not.toThrow();
	})
})
