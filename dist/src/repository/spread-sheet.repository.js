import { Posts } from "../domain/posts.js";
import { google } from "googleapis";
import { Blogs } from "../domain/blogs.js";
import { envValidator } from "../util/validator/env-validator.js";
export class SpreadSheetRepository {
    envValidator;
    auth;
    sheetApi;
    spreadsheetId;
    constructor(envValidator) {
        this.envValidator = envValidator;
        this.spreadsheetId = this.envValidator.getOrThrow('GOOGLE_SHEET_ID');
        this.auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: this.envValidator.getOrThrow('GOOGLE_CLIENT_EMAIL'),
                private_key: this.envValidator.getOrThrow('GOOGLE_PRIVATE_KEY')
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });
        this.sheetApi = google.sheets({
            version: 'v4',
            auth: this.auth,
        }).spreadsheets.values;
    }
    async readPosts() {
        return new Posts([]);
    }
    async updateSubscribeBlog(posts) {
        const rawBlogs = await this.sheetApi.get({
            range: 'Blogs!A2:G100',
            spreadsheetId: this.spreadsheetId,
        });
        const values = rawBlogs.data.values;
        if (!values) {
            throw new Error('No data found.');
        }
        const blogs = new Blogs(values);
        blogs.update(posts.blog);
        await this.sheetApi.batchUpdate({
            spreadsheetId: this.spreadsheetId,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: [blogs.toValues]
            }
        });
    }
    async readSubscribeBlog() {
        const result = await this.sheetApi.get({
            range: 'Blogs!A2:G100',
            spreadsheetId: this.spreadsheetId,
        });
        const values = result.data.values;
        if (!values) {
            throw new Error('No data found.');
        }
        const blogs = new Blogs(values);
        const subscribeBlog = blogs.subscribeBlog;
        if (!subscribeBlog) {
            throw new Error('No publish blog found.');
        }
        return subscribeBlog;
    }
}
export const spreadSheetRepository = new SpreadSheetRepository(envValidator);
