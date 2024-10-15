export class Posts {
    _blog;
    posts;
    constructor(posts, blog = null) {
        this.posts = posts;
        this._blog = blog;
    }
    get isEmpty() {
        return this.posts.length === 0;
    }
    get length() {
        return this.posts.length;
    }
    get blog() {
        if (!this._blog) {
            throw new Error('No blog');
        }
        return this._blog;
    }
    get subscribeFiles() {
        this._blog?.fetchLastPublishedAt(this.posts.length);
        return this.posts.map(post => ({
            path: `${post.language}/${post.index}.md`,
            content: post.content,
        }));
    }
    filterNewPosts(lastSyncedAt) {
        return new Posts(this.posts.filter(post => post.uploadedAt > lastSyncedAt), this._blog);
    }
}
