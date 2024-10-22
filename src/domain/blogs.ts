import {BlogEntity, BlogMetadata} from "./blog.entity";
import {sheets_v4} from "googleapis";

export type BlogsMetadata = Array<BlogMetadata>;

export class Blogs {
	private blogs: BlogEntity[];

	constructor(values: string[][] | BlogEntity[]) {
		let blogs: BlogEntity[] = [];
		if (values.length === 0) {
			this.blogs = [];
		}
		else if (values[0] instanceof BlogEntity) {
			blogs = values as BlogEntity[];
		}
		else {
			blogs = values.map((value) => new BlogEntity(value)).filter(blog => blog.isValidEntity);
		}
		blogs = blogs.filter(blog => !blog.isUnsubscriber);
		const publisherBlogs = blogs.filter(blog => blog.isPublisher);
		if (publisherBlogs.length > 1) {
			throw new Error(`Publisher 블로그는 1개만 존재해야합니다. ${blogs.map(blog => blog.title).join(',')} 중 하나만 선택해주세요.`);
		}
		if (publisherBlogs.length === 0) {
			throw new Error('Publisher 블로그가 존재하지 않습니다. Publisher 블로그를 선택해주세요.');
		}
		this.blogs = blogs;
	}

	get publisherBlog(): BlogEntity | null {
		const publishBlog = this.blogs.find(blog => blog.isPublisher);
		return publishBlog ?? null;
	}

	get toValues() :sheets_v4.Schema$ValueRange {
		return {
			range: 'Blogs!A2:G100',
			values: this.blogs.map(blog => blog.toValue)
		};
	};

	get length() {
		return this.blogs.length;
	}

	get metadata(): BlogsMetadata {
		return this.blogs.map(blog => blog.metadata);
	};

	update(updateBlog: BlogEntity) {
		const index =this.blogs.findIndex((blog) => blog.rssUrl === updateBlog.rssUrl);
		if (index === -1) {
			this.blogs.push(updateBlog);
		} else {
			this.blogs[index] = updateBlog;
		}
	}
}
