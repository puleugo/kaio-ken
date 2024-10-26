import {Posts} from "../domain/posts";
import {githubRepository, GithubRepositoryInterface} from "../repository/github.repository";
import {Metadata} from "../domain/metadata";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {GithubUploadFileBuilder} from "../domain/github-upload-files";
import {Blogs} from "../domain/blogs";

export interface GithubUploaderInterface {
	uploadPosts(ports: Posts, blogs: Blogs): Promise<Metadata>;
}

export class GithubUploader implements GithubUploaderInterface{
	constructor(private readonly githubRepository: GithubRepositoryInterface, private readonly logger: LoggerInterface) {
	}

	async uploadPosts(newPosts: Posts, blogs: Blogs): Promise<Metadata> {
		if (newPosts.isEmpty){
			throw new Error('새로운 포스트가 없어 업로드를 진행하지 않습니다.');
		}
		this.logger.debug('새로운 포스트가 발견되어 업로드를 진행합니다.');
		const jsonString = await this.githubRepository.readOrNull(Metadata.path);
		const metadata: Metadata = jsonString ? new Metadata(JSON.parse(jsonString)) : new Metadata({posts: newPosts, blogs});

		await this.githubRepository.upload(
			new GithubUploadFileBuilder()
				.addPosts(newPosts)
				.putBlogs(blogs)
				.putMetadata(metadata)
				.build()
		);
		return metadata
	}
}

export const githubUploader = new GithubUploader(githubRepository, githubActionLogger);
