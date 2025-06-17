import { Blogs } from "@src/module/domain/blogs";
import { Metadata } from "@src/module/domain/metadata";
import { BlogMother } from "./blog.mother";

export namespace MetadataMother {
	export function create(
		publisher = BlogMother.createPublisher(),
		blogs = [BlogMother.createSubscriber(), BlogMother.createUnSubscriber()],
	): Metadata {
		return Metadata.from({
			publisher,
			blogs: Blogs.of(blogs).getValue(),
		}).getValue();
	}
}
