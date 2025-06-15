import { AutoIncrementManager } from "@src/core/auto-increment-manager";
import { BlogEntity } from "@src/module/domain/blog.entity";
import { Blogs } from "@src/module/domain/blogs";
import { PostEntity } from "@src/module/domain/post.entity";
import { githubFileReader } from "@src/module/implemention";

export async function setupAutoIncrementIds() {
	const metadata = await githubFileReader.getMetadata();
	const blogs = Blogs.of([])
		.getValue()
		.put(metadata.publisher)
		.getValue()
		.putAll(metadata.subscriberBlogs.getAll())
		.getValue();
	const lastBlogId = blogs.getLastBlogId();
	const lastPostId = await githubFileReader.getLastPostId();

	AutoIncrementManager.instance.register(BlogEntity.ENTITY_KEY, lastBlogId);
	AutoIncrementManager.instance.register(PostEntity.ENTITY_KEY, lastPostId);
}
