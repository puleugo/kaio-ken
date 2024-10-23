import {Posts} from "../domain/posts";
import {google} from "googleapis";
import {Blogs} from "../domain/blogs";
import {envManager, EnvManagerInterface} from "../util/config/env-manager";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {BlogEntity} from "../domain/blog.entity";

export interface SpreadSheetRepositoryInterface {
	readPosts(): Promise<Posts>;

	readBlogs(): Promise<Blogs>

	updateSubscribeBlog(posts: Posts, publisherBlog: BlogEntity): Promise<void>;
}


export class SpreadSheetRepository implements SpreadSheetRepositoryInterface {
	private auth = null;
	private sheetApi = null;
	private spreadsheetId: string;
	constructor(private readonly envValidator: EnvManagerInterface, private readonly logger: LoggerInterface) {}

	authenticateIfNeeded() {
		if (this.auth && this.sheetApi) {
			return;
		}
		this.spreadsheetId = this.envValidator.getOrThrow('GOOGLE_SHEET_ID');
		this.logger.debug('구글 API 접근에 대한 인증을 시도합니다.')
		this.auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: this.envValidator.getOrThrow('GOOGLE_CLIENT_EMAIL'),
				private_key: this.envValidator.getOrThrow('GOOGLE_PRIVATE_KEY')
			},
			scopes: [
				'https://www.googleapis.com/auth/spreadsheets',
			],
		});
		this.logger.debug('스프레드 시트 API 접근에 대한 인증을 시도합니다.')
		this.sheetApi = google.sheets({
			version: 'v4',
			auth: this.auth,
		}).spreadsheets.values;
	}

	async readPosts(): Promise<Posts> {
		return new Posts([]);
	}

	async updateSubscribeBlog(posts: Posts, publisherBlog: BlogEntity): Promise<void> {
		this.authenticateIfNeeded();
		const rawBlogs  = await this.sheetApi.get({
			range: 'Blogs!A2:G100',
			spreadsheetId: this.spreadsheetId,
		});
		const values = rawBlogs.data.values;
		if (!values) {
			throw new Error('갱신할 블로그가 스프레드 시트에서 사라졌습니다. 스프레드 시트를 확인 후 다시 실행해주세요.');
		}
		const blogs = new Blogs(values);
		blogs.update(publisherBlog)

		await this.sheetApi.batchUpdate({
			spreadsheetId: this.spreadsheetId,
			requestBody: {
				valueInputOption: 'USER_ENTERED',
				data: [blogs.toValues]
			}
		})
		this.logger.debug('갱신에 성공했습니다.')
	}

	async readBlogs(): Promise<Blogs> {
		this.authenticateIfNeeded();
		this.logger.debug('블로그 정보를 읽어옵니다.')
		const result = await this.sheetApi.get({
			range: 'Blogs!A2:G100',
			spreadsheetId: this.spreadsheetId,
		});
		const values = result.data.values;
		if (!values) {
			throw new Error('블로그 시트에 데이터가 없습니다.');
		}
		this.logger.debug('블로그 정보를 읽어왔습니다.')
		const blogs = new Blogs(values)
		this.logger.debug(`${blogs.length}개의 블로그 정보를 파싱했습니다.`)
		const subscribeBlog = blogs.publisherBlog;
		if (!subscribeBlog) {
			throw new Error('발행 블로그로 설정된 블로그가 없습니다. 발행 블로그를 \'PUBLISHER\'으로 설정해주세요.');
		}
		return blogs;
	}
}


export const spreadSheetRepository = new SpreadSheetRepository(envManager, githubActionLogger);
