import {RssRepository} from "../../src/repository/rss.repository";
import {BlogMother} from "../fixture/blog.mother";

describe('RssRepository Integration Test', () => {
	let repository: RssRepository;

	beforeEach(() => {
		repository = new RssRepository(console);
	})

	it('게시글을 읽어온다.', async () => {
		const blog = BlogMother.createRealPublisher();
		await repository.readPosts(blog);
	})
	it.todo('RSS를 통해 게시글을 가져오는데 실패하면 에러를 반환해야한다.');
})
