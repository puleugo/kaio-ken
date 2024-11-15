import {Posts} from "../domain/posts";
import {google} from "googleapis";
import {Blogs} from "../domain/blogs";
import {EnvManager, envManager, EnvManagerInterface} from "../util/config/env-manager";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import { sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';

// TODO: 개에바임. 이렇게 짜면 테스트 못함. 파싱로직은 따로 빼서 테스트하자.
export interface SpreadSheetRepositoryInterface {
	write(valueRange: sheets_v4.Schema$ValueRange): Promise<void>;

	readPosts(): Promise<Posts>;

	readBlogs(): Promise<Blogs>

	update(posts: Posts, blogs: Blogs): Promise<void>;

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

		this.logger.debug('구글 PRIVATE KEY를 가져옵니다.');
		const privateKey = this.envValidator.getOrThrow('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');
		if (!EnvManager.isvalidPem(privateKey)) {
			this.logger.error('구글 PRIVATE KEY가 올바르지 않습니다. PEM 형식이어야 합니다.')
			throw new Error('구글 PRIVATE KEY가 올바르지 않습니다. PEM 형식이어야 합니다.')
		}

		this.logger.debug('구글 API 접근에 대한 인증을 시도합니다.')
		try {
			this.auth = new google.auth.GoogleAuth({
				credentials: {
					client_email: this.envValidator.getOrThrow('GOOGLE_CLIENT_EMAIL'),
					private_key: privateKey,
				},
				scopes: [
					'https://www.googleapis.com/auth/spreadsheets',
				],
			});
		} catch (e) {
			this.logger.error('구글 API 접근에 대한 인증에 실패했습니다. 구글 API 인증 정보를 확인해주세요.')
			throw e;
		}
		this.logger.debug('스프레드 시트 API 접근에 대한 인증을 시도합니다.')

		try {
			this.sheetApi = google.sheets({
				version: 'v4',
				auth: this.auth,
			}).spreadsheets.values;
		} catch (e) {
			this.logger.error('스프레드 시트 API 접근에 대한 인증에 실패했습니다. 구글 API 인증 정보를 확인해주세요.')
			throw e;
		}
	}

	async readPosts(): Promise<Posts> {
		return new Posts([]);
	}

	async update(translatedPosts: Posts, blogs: Blogs): Promise<void> {
		this.authenticateIfNeeded();
		const values = await this.getSheetValues('Blogs!A2:G100')
		if (!values) {
			throw new Error('갱신할 블로그가 스프레드 시트에서 사라졌습니다. 스프레드 시트를 확인 후 다시 실행해주세요.');
		}

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
