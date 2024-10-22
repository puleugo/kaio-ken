import { Blogs } from "../../src/domain/blogs";
import { Posts } from "../../src/domain/posts";
import {SpreadSheetRepositoryInterface} from "../../src/repository/spread-sheet.repository";

export class SpreadSheetRepositoryStub implements SpreadSheetRepositoryInterface {
    private _blogs: Blogs;
    private _posts: Posts;
    private _readCount = 0;
    set blogs(blogs: Blogs) {
        this._blogs = blogs;
    }
    set posts(posts: Posts) {
        this._posts = posts;
    }

    async readPosts(): Promise<Posts> {
        return this._posts;
    }
    async readBlogs(): Promise<Blogs> {
        this._readCount++;
        return this._blogs;
    }
    updateSubscribeBlog(posts: Posts): Promise<void> {
        throw new Error("Method not implemented.");
    }

	reset() {
        this._readCount = 0;
        this.blogs = new Blogs([]);
	}
}
