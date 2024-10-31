import {Metadata} from "../domain/metadata";
import {Posts} from "../domain/posts";
import {githubRepository, GithubRepositoryInterface} from "../repository/github.repository";
import {HrefTagEnum} from "../type";

export interface GithubReaderInterface {
	readMetadata(): Promise<Metadata | null>;

	readPosts(language: HrefTagEnum, shouldTranslatePostIndexes: Set<any>): Promise<Posts>;
}

class GithubReader implements GithubReaderInterface{
	constructor(private readonly repository: GithubRepositoryInterface) {
	}

    async readMetadata(): Promise<Metadata | null> {
		const content = await this.repository.readOrNull(Metadata.path);
		return content ? new Metadata(JSON.parse(content)) : null;
    }

	async readPosts(language: HrefTagEnum, shouldTranslatePostIds: Set<number>): Promise<Posts> {
		const metadata = await this.readMetadata();
		if (metadata === null) {
			throw new Error('metadata가 없습니다.');
		}

		const rawPosts = await this.repository.getFilesInDirectory(`${language}`);

		// remove extenstion from string
		const filteredRawPosts = rawPosts.filter((raw) => shouldTranslatePostIds.has(Number(raw.name.split('.')[0])));
		const postEntities = await Promise.all(filteredRawPosts.map(async (raw) => {
			const index = Number(raw.name.split('.')[0]);
			const post = metadata.getPostById(index);
			post.content = await this.repository.readOrNull(`${language}/${raw.name}`);
			return post;
		}))
		return new Posts(postEntities);
	}
}

export const githubReader = new GithubReader(githubRepository);
