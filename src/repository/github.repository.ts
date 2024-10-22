import {Posts} from "../domain/posts";
import axios from "axios";
import {envValidator, EnvManagerInterface} from "../util/config/env-manager";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {GithubUploadFile} from "../domain/github-upload-files";
import {Metadata} from "../domain/metadata";

export interface GithubRepositoryInterface {
	upload(files: GithubUploadFile[]): Promise<Metadata>;
	readOrNull(filePath: string): Promise<string>;
}

export class GithubRepository implements GithubRepositoryInterface {
	private config: { owner: string; repo: string; auth: string; branch: string };
	private readonly githubApiUrl = 'https://api.github.com';
	private referenceUrl: string;
	private commitUrl: string;
	private treeWriteUrl: string;
	private headers: { Accept: string; Authorization: string };
	private readonly MODES = { FILE: '100644', FOLDER: '040000' };
	private readonly TYPE = { BLOB: 'blob', TREE: 'tree' };

	constructor(private readonly envValidator: EnvManagerInterface, private readonly logger: LoggerInterface) {}

	authenticateIfNeeded() {
		this.config = {
			owner: this.envValidator.getOrThrow('GH_USER'),
			repo: this.envValidator.getOrThrow('GH_REPOSITORY'),
			auth: this.envValidator.getOrThrow('GH_TOKEN'),
			branch: 'main',
		};

		this.referenceUrl = `${this.githubApiUrl}/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch}`;
		this.commitUrl = `${this.githubApiUrl}/repos/${this.config.owner}/${this.config.repo}/git/commits`;
		this.treeWriteUrl = `${this.githubApiUrl}/repos/${this.config.owner}/${this.config.repo}/git/trees`;
		this.headers = {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `Bearer ${this.config.auth}`,
		};
	}

	getTreeReadUrl(treeSha: string) {
		return `${this.githubApiUrl}/repos/${this.config.owner}/${this.config.repo}/git/trees/${treeSha}`;
	}

	async upload(files: GithubUploadFile[]): Promise<Metadata> {
		this.authenticateIfNeeded();
		const { data: { object: { sha: currentCommitSha } } } = await axios({ url: this.referenceUrl, headers: this.headers });
		const currentCommitUrl = `${this.commitUrl}/${currentCommitSha}`;
		const { data: { tree: { sha: treeSha } } } = await axios({ url: currentCommitUrl, headers: this.headers });
		const { data: { sha: newTreeSha } } = await axios({
			url: this.treeWriteUrl,
			method: 'POST',
			headers: this.headers,
			data: {
				base_tree: treeSha,
				tree: files
					.map(({ content, path }: GithubUploadFile) => (
						content
							? { path, content, mode: this.MODES.FILE, type: this.TYPE.BLOB } // Works for text files, utf-8 assumed
							: { path, sha: null, mode: this.MODES.FILE, type: this.TYPE.BLOB } // If sha is null => the file gets deleted
					)),
			},
		});
		this.logger.debug('마크다운 포스트 커밋 생성 완료');

		const { data: { sha: newCommitSha } } = await axios({
			url: this.commitUrl,
			method: 'POST',
			headers: this.headers,
			data: {
				message: 'Committing with GitHub\'s API :fire:',
				tree: newTreeSha,
				parents: [ currentCommitSha ],
			},
		});

		// Make BRANCH_NAME point to the created commit
		await axios({
			url: this.referenceUrl,
			method: 'POST',
			headers: this.headers,
			data: { sha: newCommitSha },
		});
		this.logger.debug('마크다운 포스트 업로드 완료');

		const {data} = await axios({
			url: this.getTreeReadUrl(newTreeSha),
			headers: this.headers,
		});
		const rawMetadata = data.tree.find((file: { path: string; }) => file.path === Metadata.path);
		return new Metadata(JSON.parse(rawMetadata.content));
	}

	async readOrNull(filePath: string): Promise<string | null> {
		this.authenticateIfNeeded();
		return '';
	}


	private generateMetadataJson(posts: Posts) {
		return {
			posts: posts
		}
	}
}



export const githubRepository = new GithubRepository(envValidator, githubActionLogger);
