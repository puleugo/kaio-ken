import { authConfig } from "@src/config/auth.config";
import { BlogPlatform } from "@src/module/domain/blog-platform";
import { githubFileReader } from "@src/module/implemention";
import { BlogPlatformUploader } from "@src/module/implemention/blog-platform-uploader";
import { QiitaUploader } from "@src/module/implemention/blog-uploader-strategy/qiita-uploader";
import { AxiosClient } from "@src/module/repository/driver/axios-client";

export async function setupBlogUploader() {
	const metadata = await githubFileReader.getMetadata();

	for (const blog of metadata.subscriberBlogs.getSubscribers()) {
		switch (blog.platform.toString()) {
			case BlogPlatform.values.qiita.toString(): {
				BlogPlatformUploader.register(
					blog.platform,
					new QiitaUploader({ token: authConfig.QIITA_TOKEN }, new AxiosClient()),
				);
				break;
			}
			default:
				throw new Error(`Unsupported blog platform: ${blog.platform}`);
		}
	}
}
