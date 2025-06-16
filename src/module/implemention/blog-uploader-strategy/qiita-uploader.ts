import { PostUploadedDate } from "../../domain/post-uploaded-date";
import { PostUrl } from "../../domain/post-url";
import type { Translation } from "../../domain/translation";
import { BodyInserter, type WebClient } from "../../repository/web.client";
import { BlogPlatformUploader } from "../blog-platform-uploader";

type QiitaUploadPayload = {
	title: string;
	body: string;
	tags: { name: string; versions: string[] }[];
	coediting?: boolean;
	group_url_name?: string;
	private?: boolean;
	tweet?: boolean;
	organization_url_name?: string | null;
	slides?: boolean;
};

interface QiitaUploaderOptions {
	token: string;
}

export class QiitaUploader extends BlogPlatformUploader {
	constructor(
		private readonly options: QiitaUploaderOptions,
		client: WebClient,
	) {
		super(client);
	}

	async putUpload(post: Translation): Promise<Translation> {
		const payload: QiitaUploadPayload = {
			title: post.title,
			body: post.body,
			tags: [
				{ name: "test", versions: [] },
				{ name: "rails", versions: [] },
			],
			// coediting: false,
			// group_url_name: "dev",
			private: false,
			// tweet: false,
			// organization_url_name: null,
			// slides: false,
		};

		const response = await this.client
			.uri("https://qiita.com/api/v2/items")
			.headers({
				Authorization: `Bearer ${this.options.token}`,
				"Content-Type": "application/json",
			})
			.post()
			.body(BodyInserter.fromJSON(payload))
			.retrieve();
		if (response.statusCode !== 201)
			throw new Error(`Qiita API Failed: ${response.statusCode}, ${response.jsonBody.message}`);

		const postUrlResult = PostUrl.from(String(response.jsonBody.url));
		if (postUrlResult.isFailed) throw new Error(postUrlResult.getReason());

		const postUploadedDateResult = PostUploadedDate.from(new Date(String(response.jsonBody.created_at)));
		if (postUploadedDateResult.isFailed) throw new Error(postUploadedDateResult.getReason());

		post.putUploadData(postUrlResult.getValue(), postUploadedDateResult.getValue());
		return post;
	}
}
