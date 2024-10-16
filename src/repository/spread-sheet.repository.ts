import {Posts} from "../domain/posts.js";
import {google} from "googleapis";
import {BlogEntity} from "../domain/blog.entity.js";
import {Blogs} from "../domain/blogs.js";
import {envValidator, EnvValidatorInterface} from "../util/validator/env-validator.js";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";

export interface SpreadSheetRepositoryInterface {
	readPosts(): Promise<Posts>;

	readSubscribeBlog(): Promise<BlogEntity>

	updateSubscribeBlog(posts: Posts): Promise<void>;
}


export class SpreadSheetRepository implements SpreadSheetRepositoryInterface {
	private auth;
	private sheetApi;
	private readonly spreadsheetId: string;

	constructor(private readonly envValidator: EnvValidatorInterface, private readonly logger: LoggerInterface) {
		this.spreadsheetId = this.envValidator.getOrThrow('GOOGLE_SHEET_ID');
		logger.debug('구글 API 접근에 대한 인증을 시도합니다.')
		this.auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: this.envValidator.getOrThrow('GOOGLE_CLIENT_EMAIL'),
				private_key: this.envValidator.getOrThrow('GOOGLE_PRIVATE_KEY')
			},
			scopes: [
				'https://www.googleapis.com/auth/spreadsheets',
			],
		});
		logger.debug('스프레드 시트 API 접근에 대한 인증을 시도합니다.')
		this.sheetApi = google.sheets({
			version: 'v4',
			auth: this.auth,
		}).spreadsheets.values;
	}

	async readPosts(): Promise<Posts> {
		return new Posts([]);
	}

	async updateSubscribeBlog(posts: Posts): Promise<void> {
		const rawBlogs  = await this.sheetApi.get({
			range: 'Blogs!A2:G100',
			spreadsheetId: this.spreadsheetId,
		});
		const values = rawBlogs.data.values;
		if (!values) {
			this.logger.error('갱신할 블로그가 스프레드 시트에서 사라졌습니다. 스프레드 시트를 확인 후 다시 실행해주세요.')
			throw new Error('갱신할 블로그가 스프레드 시트에서 사라졌습니다. 스프레드 시트를 확인 후 다시 실행해주세요.');
		}
		const blogs = new Blogs(values);
		blogs.update(posts.blog)

		await this.sheetApi.batchUpdate({
			spreadsheetId: this.spreadsheetId,
			requestBody: {
				valueInputOption: 'USER_ENTERED',
				data: [blogs.toValues]
			}
		})
		this.logger.debug('갱신에 성공했습니다.')
	}

	async readSubscribeBlog(): Promise<BlogEntity> {
		this.logger.debug('블로그 정보를 읽어옵니다.')
		const result = await this.sheetApi.get({
			range: 'Blogs!A2:G100',
			spreadsheetId: this.spreadsheetId,
		});
		const values = result.data.values;
		if (!values) {
			this.logger.debug('블로그 시트에 데이터가 없습니다.')
			throw new Error('블로그 시트에 데이터가 없습니다.');
		}
		const blogs = new Blogs(values)
		const subscribeBlog = blogs.subscribeBlog;
		if (!subscribeBlog) {
			this.logger.debug('발행 블로그로 설정된 블로그가 없습니다. 발행 블로그 여부를 TRUE로 설정해주세요.')
			throw new Error('No publish blog found.');
		}
		return subscribeBlog;
	}
}


export const spreadSheetRepository = new SpreadSheetRepository(envValidator, githubActionLogger);
