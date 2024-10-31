import {MediumStrategy, PostUploader} from "../../src/implemention/post.uploader";
import 'dotenv/config';
import {envManager} from "../../src/util/config/env-manager";
import {PostMother} from "../fixture/PostMother";
import {Posts} from "../../src/domain/posts";
import {BlogPlatformEnum} from "../../src/type";

describe('PostUploader Integration Test', () => {
	let postUploader: PostUploader;

	beforeAll(() => {
		postUploader = new PostUploader(console);
	})

	describe('MediumStrategy', () => {
		beforeAll(() => {
			envManager.putOrThrow('MEDIUM_TOKEN', process.env['MEDIUM_TOKEN']);
			postUploader.registerStrategy(BlogPlatformEnum.Medium, new MediumStrategy(envManager));
		})

		// FIXME: metadata 주입하도록 변경
		it('게시글을 업로드 한다.', async () => {
			// const posts = new Posts(PostMother.createMany(3).map(post => {post.content = 'test'; return post}));
			// const uploadedPosts = await postUploader.upload(posts);
			// expect(uploadedPosts).not.toBeNull();
		});
	})
})
