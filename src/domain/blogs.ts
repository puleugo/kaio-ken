import {BlogEntity} from "./blog.entity.js";
import {sheets_v4} from "googleapis";

export class Blogs {
	private blogs: BlogEntity[];

	constructor(values: string[][]) {
		this.blogs = values.map((value) => new BlogEntity(value)).filter(blog => blog.isValidEntity);
	}

	get subscribeBlog(): BlogEntity | null {
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
	update(updateBlog: BlogEntity) {
		const index =this.blogs.findIndex((blog) => blog.rssUrl === updateBlog.rssUrl);
		if (index === -1) {
			this.blogs.push(updateBlog);
		} else {
			this.blogs[index] = updateBlog;
		}
	}
}
