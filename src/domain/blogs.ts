import {BlogEntity, BlogMetadata} from "./blog.entity";
import {sheets_v4} from "googleapis";
import {Posts} from "./posts";
import {blogLanguageMap, HrefTagEnum} from "../type";

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
			blogs = values.map((value) => new BlogEntity(value));
		}
		blogs = blogs.filter(blog => !blog.isUnsubscriber);
		const publisherBlogs = blogs.filter(blog => blog.isPublisher);
		if (publisherBlogs.length > 1) {
			throw new Error(`Publisher 블로그는 1개만 존재해야합니다. ${blogs.map(blog => blog.title).join(',')} 중 하나만 선택해주세요.`);
		}
		// if (publisherBlogs.length === 0) {
		// 	throw new Error('Publisher 블로그가 존재하지 않습니다. Publisher 블로그를 선택해주세요.');
		// }
		this.blogs = blogs;
	}

	private get publisherBlogIndex(): number {
		return this.blogs.findIndex(blog => blog.isPublisher);
	}

	get publisherBlog(): BlogEntity | null {
		const publishBlog = this.blogs.find(blog => blog.isPublisher);
		return publishBlog ?? null;
	}

	get toValuesWithRange() :sheets_v4.Schema$ValueRange {
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

	/**
	 * 이전 메타데이터와 신규 포스트 데이터를 기반으로 블로그 정보를 업데이트한다.
	 * 블로그명, RSS주소, 플랫폼, 발행블로그 여부는 변경될 수 있습니다.
	 * 마지막 발행 게시글 ID, 마지막 배포일은 메타데이터의 정보를 기반으로 사용됩니다.
	 * @param newPosts RSS를 통해 읽어온 신규 포스트
	 * @param newBlogs SpreadSheet에서 읽어온 블로그 정보
	 */
	updateByNewData(newPosts: Posts, newBlogs: Blogs): void {
		this.blogs.forEach((blog) => {
			if (blog.isPublisher) {
				blog.addPosts(newPosts);
				blog.fetchPublishedAt();
			}
			// 해당 블로그 내용을 머지
			if (newBlogs.hasBlog(blog)) {
				const newBlog = newBlogs.getBlog(blog);
				blog.merge(newBlog);
			} else {
				blog.unsubscribe()
			}
		})

		const registeredBlogs = newBlogs.getComplement(this.blogs)
		this.blogs.push(...registeredBlogs);
	}

	private hasBlog(blog: BlogEntity) {
		return this.blogs.some((b) => b.rssUrl === blog.rssUrl);
	}

	private getBlog(blog: BlogEntity): BlogEntity | null {
		return blog;
	}

	private getComplement(blogs: BlogEntity[]): BlogEntity[] {
		return this.blogs.filter(blog => !blogs.some(b => b.rssUrl === blog.rssUrl));
	}

	isSamePublisherBlog(blog: BlogEntity): boolean {
		return this.publisherBlog.rssUrl === blog.rssUrl;
	}

	updatePublisherBlog(publisherBlog: BlogEntity) {
		this.blogs[this.publisherBlogIndex].merge(publisherBlog);
	}

	get subscribeBlogs(): Blogs {
		return new Blogs(this.blogs.filter(blog => !blog.isPublisher));
	}

	get languages(): Set<HrefTagEnum> {
		const languages = this.blogs.map(blog => blogLanguageMap.get(blog.platform));
		return new Set(languages);
	}

	forEach(param: (blog: BlogEntity) => void) {
		this.blogs.forEach(param);
	}
}
