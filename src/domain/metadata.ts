import {Posts, PostsMetadata} from "./posts";
import {Blogs, BlogsMetadata} from "./blogs";
import {GithubUploadFile} from "./github-upload-files";
import {PostEntity} from "./postEntity";
import {DateUtil} from "../util/util/DateUtil";
import {BlogEntity} from "./blog.entity";
import {TranslatedPosts} from "./translatedPosts";
import {FileUtil} from "../util/util/FileUtil";

export interface MetadataJson {
	posts: PostsMetadata;
	blogs: BlogsMetadata
	lastExecutedAt: string;
}

interface JsonConstructor  {
	posts: PostsMetadata;
	blogs: BlogsMetadata
	lastExecutedAt: string;
}
interface DomainConstructor {
	posts: Posts;
	blogs: Blogs;
}



export class Metadata {

	static path = 'metadata.json';
	private _posts: Posts;
	private _blogs: Blogs;
	private _lastExecutedAt: Date;

	get jsonObject(): MetadataJson {
		return {
			posts: this._posts.metadata,
			blogs: this._blogs.metadata,
			lastExecutedAt: DateUtil.formatYYYYMMDD(this.lastExecutedAt),
		};
	}

	get publishBlog(): BlogEntity{
		return this._blogs.publisherBlog;
	}

	constructor(props: JsonConstructor | DomainConstructor) {
		if (props.posts instanceof Posts && props.blogs instanceof Blogs) { // DomainConstructor
			this._lastExecutedAt = new Date();
			this._posts = props.posts.fillIndex(1);
			this._blogs = props.blogs;
		} else { // JsonConstructor
			const posts: PostEntity[] = [];
			for (const [index, value] of Object.entries(props.posts)) {
				posts.push(PostEntity.fromMetadata(Number(index), value));
			}
			this._posts = new Posts(posts);

			const blogs: BlogEntity[] = [];
			for (const value of props.blogs as BlogsMetadata) {
				blogs.push(new BlogEntity({...value, lastPublishedAt: new Date(value.lastPublishedAt)}));
			}
			this._blogs = new Blogs(blogs);
			if ((props as JsonConstructor).lastExecutedAt !== undefined) {
				this._lastExecutedAt = new Date((props as JsonConstructor).lastExecutedAt);
			} else {
				throw new Error('lastExecutedAt이 없습니다.');
			}
		}
	}

	get postLength(): number {
		return this._posts.length;
	}

	get blogLength(): number {
		return this._blogs.length;
	}

	get json(): string {
		return JSON.stringify(this.jsonObject, null, FileUtil.fileSpaces)
	}

	get lastExecutedAt(): Date {
		return new Date(this._lastExecutedAt);
	}

	get posts(): Posts {
		return this._posts;
	}

	get blogs(): Blogs {
		return this._blogs;
	}

	get githubUploadFile(): GithubUploadFile {
		return {
			path: Metadata.path,
			content: this.json
		}
	}

	/**
	 * 메타데이터에 동일한 url을 가진 게시글이 존재하는지 확인합니다.
	 * @param post
	 */
	hasPost(post: PostEntity): boolean {
		return this.posts.hasPost(post);
	}

	update(newPosts: Posts, blogs: Blogs): void {
		// Metadata의 lastExecutedAt을 오늘 날짜로 업데이트

		// SpreadSheet에서 읽어온 RSS 주소, 블로그 명, 플랫폼, 타입이 SpreadSheet의 데이터로 업데이트
		// publisherBlog의 lastPublishedIndex는 항상 Metadata.json의 값을 토대로 생성

		// 1. 퍼블리셔 블로그 업데이트
		if (this._blogs.isSamePublisherBlog(blogs.publisherBlog)) {
			this._blogs.updatePublisherBlog(blogs.publisherBlog);
		}
		// 2. 게시글 인덱싱 및 게시글 업데이트
		newPosts.fillIndex(this._blogs.publisherBlog.lastPublishedId)
		this._posts.push(newPosts.toEntities);

		// 3. 블로그 업데이트
		this._blogs.updateByNewData(newPosts, blogs)

		this._lastExecutedAt = new Date();
	}

	addTranslatedPost(translatedPosts: TranslatedPosts) {
		// 번역해야하는 게시글을 각 posts에 추가
		const posts = translatedPosts.languages.map(language => translatedPosts.getPostByLanguage(language).toEntities).flat();
		posts.forEach(post => {
			this._posts.addTranslatedPost(post.index, post);
		})
		// Metadata의 lastExecutedAt을 오늘 날짜로 업데이트
		this._lastExecutedAt = new Date();
	}

	getPostById(index: number) {
		return this._posts.getById(index);
	}

	static fromString(string: string) {
		return new Metadata(JSON.parse(string));
	}
}
