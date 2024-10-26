import {Posts} from "../domain/posts";
import {google} from "googleapis";
import {Blogs} from "../domain/blogs";
import {envManager, EnvManagerInterface} from "../util/config/env-manager";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {BlogEntity} from "../domain/blog.entity";
import { sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';

export interface SpreadSheetRepositoryInterface {
	write(valueRange: sheets_v4.Schema$ValueRange): Promise<void>;

	readPosts(): Promise<Posts>;

	readBlogs(): Promise<Blogs>

	updatePublisherBlog(posts: Posts, publisherBlog: BlogEntity): Promise<void>;

	truncate(range: string): Promise<void>;
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

	async updatePublisherBlog(clonedPosts: Posts, publisherBlog: BlogEntity): Promise<void> {
		this.authenticateIfNeeded();

		publisherBlog.fetchPublishedInfo(clonedPosts)

		const values = await this.getSheetValues('Blogs!A2:G100')
		if (!values) {
			throw new Error('갱신할 블로그가 스프레드 시트에서 사라졌습니다. 스프레드 시트를 확인 후 다시 실행해주세요.');
		}

		const blogs = new Blogs(values);
		blogs.update(publisherBlog)

		await this.write(blogs.toValuesWithRange)
		this.logger.debug('갱신에 성공했습니다.')
	}

	async readBlogs(): Promise<Blogs> {
		this.authenticateIfNeeded();

		this.logger.debug('블로그 정보를 읽어옵니다.')
		const values = await this.getSheetValues('Blogs!A2:G100')
		if (!values) {
			throw new Error('블로그 시트에 데이터가 없습니다.');
		}

		const blogs = new Blogs(values)
		this.logger.debug(`${blogs.length}개의 블로그 정보를 파싱했습니다.`)

		const subscribeBlog = blogs.publisherBlog;
		if (!subscribeBlog) {
			throw new Error('발행 블로그로 설정된 블로그가 없습니다. 발행 블로그를 \'PUBLISHER\'으로 설정해주세요.');
		}

		return blogs;
	}

	async truncate(range: string): Promise<void> {
		this.authenticateIfNeeded();

		await this.sheetApi.clear({
			spreadsheetId: this.spreadsheetId,
			range: range
		})
		return;
	}

	private async getSheet(range: string): Promise<sheets_v4.Schema$ValueRange> {

		return await this.sheetApi.get({
			range: 'Blogs!A2:G100',
			spreadsheetId: this.spreadsheetId,
		});
	}

	private async getSheetValues(range: string): Promise<string[][]> {
		this.authenticateIfNeeded();
		const result = await this.sheetApi.get({
			range: range,
			spreadsheetId: this.spreadsheetId,
		});
		return result.data.values;
	}

	async write(valueRange: sheets_v4.Schema$ValueRange) {
		this.authenticateIfNeeded();
		await this.sheetApi.batchUpdate({
			spreadsheetId: this.spreadsheetId,
			requestBody: {
				valueInputOption: 'USER_ENTERED',
				data: [valueRange]
			}
		})
	}
}


export const spreadSheetRepository = new SpreadSheetRepository(envManager, githubActionLogger);
