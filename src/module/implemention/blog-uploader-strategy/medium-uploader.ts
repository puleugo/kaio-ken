import { PostUrl } from "@src/module/domain/post-url";
import type { Translation } from "@src/module/domain/translation";
import { BlogPlatformUploader } from "@src/module/implemention/blog-platform-uploader";
import { BodyInserter, type WebClient } from "@src/module/repository/web.client";
import { StringBuilder } from "@src/shared/util/string-builder";

interface MediumUploaderOptions {
	token: string;
}
/**
 * @deprecated medium api closed
 */
class MediumUploader extends BlogPlatformUploader {
	private userId: string | null = null;

	constructor(
		private readonly options: MediumUploaderOptions,
		client: WebClient,
	) {
		super(client);
	}

	private async getUserId(): Promise<string> {
		const result = await this.client.uri("https://api.medium.com/v1/me").retrieve();
		if (result.statusCode !== 200) {
			throw new Error("Medium API 호출에 실패했습니다.");
		}
		// @ts-ignore
		return String(result.jsonBody?.data.id);
	}

	async putUpload(post: Translation): Promise<Translation> {
		if (!this.userId) this.userId = await this.getUserId();

		const response = await this.client
			.uri(`https://api.medium.com/v1/users/${this.userId}/posts`)
			.headers({
				Authorization: `Bearer ${this.options.token}`,
				"Content-Type": "application/json",
			})
			.body(
				BodyInserter.fromJSON({
					title: post.title.toString(),
					contentFormat: "markdown",
					content: new StringBuilder()
						.appendLine(`#${post.title.toString()}`)
						.appendLine()
						.appendLine("## Published By Kaio-ken")
						.appendLine()
						.appendLine()
						.appendLine()
						.append(post.content.toString())
						.toString(),
					publishStatus: "public",
				}),
			)
			.retrieve();
		if (response.statusCode === 429) throw new Error("Medium API Rate Limit Over");
		if (response.statusCode === 403) throw new Error("Medium API Forbidden");
		if (response.statusCode !== 201) throw new Error(`Medium API Failed: ${response.statusCode}`);

		const rawUrl = String(response.jsonBody.url);
		const postUrlOrFailure = PostUrl.from(rawUrl);
		if (postUrlOrFailure.isFailed) throw new Error(postUrlOrFailure.getReason());
		post.putUploadData(postUrlOrFailure.getValue());

		return post;
	}
}
