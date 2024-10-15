import { BlogEntity } from "./blog.entity.js";
export class Blogs {
    blogs;
    constructor(values) {
        this.blogs = values.map((value) => new BlogEntity(value)).filter(blog => blog.isValidEntity);
    }
    get subscribeBlog() {
        const publishBlog = this.blogs.find(blog => blog.isPublisher);
        return publishBlog ?? null;
    }
    get toValues() {
        return {
            range: 'Blogs!A2:G100',
            values: this.blogs.map(blog => blog.toValue)
        };
    }
    ;
    get length() {
        return this.blogs.length;
    }
    update(updateBlog) {
        const index = this.blogs.findIndex((blog) => blog.rssUrl === updateBlog.rssUrl);
        if (index === -1) {
            this.blogs.push(updateBlog);
        }
        else {
            this.blogs[index] = updateBlog;
        }
    }
}
