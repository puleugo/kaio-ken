import {Posts} from "../domain/posts";
import axios from "axios";
import {envManager, EnvManagerInterface} from "../util/config/env-manager";
import {githubActionLogger, LoggerInterface} from "../util/logger/github-action.logger";
import {GithubUploadFile} from "../domain/github-upload-files";
import {Metadata} from "../domain/metadata";

export interface GithubRepositoryInterface {
	upload(files: GithubUploadFile[]): Promise<Metadata>;
	readOrNull(filePath: string): Promise<string>;
	deleteFile(filePath: string): void;
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
		if (this.config) {
			return;
		}
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

	getFileContentPath(filePath: string) {
		return `${this.githubApiUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}`;
	}

	async upload(files: GithubUploadFile[]): Promise<Metadata> {
		if (files.length === 0) {
			throw new Error('업로드할 글이 없습니다.');
		}
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
			validateStatus: (status =>  status < 500)
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
			validateStatus: (status =>  status < 500)
		});

		// Make BRANCH_NAME point to the created commit
		await axios({
			url: this.referenceUrl,
			method: 'POST',
			headers: this.headers,
			data: { sha: newCommitSha },
			validateStatus: (status =>  status < 500)
		});
		this.logger.debug('마크다운 포스트 업로드 완료');

		const {data} = await axios({
			url: this.getFileContentPath(Metadata.path),
			headers: this.headers,
			validateStatus: (status =>  status < 500)
		});
		const rawMetadata = Buffer.from(data.content, 'base64').toString();
		return new Metadata(JSON.parse(rawMetadata));
	}

	async readOrNull(filePath: string): Promise<string | null> {
		this.authenticateIfNeeded();
		const {status, data} = await axios({
			url: this.getFileContentPath(filePath),
			headers: this.headers,
			validateStatus: (status => status < 500)
		})
		if (status === 404) {
			return null
		} else if (status == 200) {
			return Buffer.from(data.content, 'base64').toString();
		}
	}

	async getFilesInDirectory(path: string) {
		this.authenticateIfNeeded();
		const response = await axios({
			url: this.getFileContentPath(path),
			headers: this.headers,
			validateStatus: (status =>  status < 500)
		});
		return response.data;
	}

	async deleteFile(path: string, sha?: string) {
		this.authenticateIfNeeded();
		if (!sha) {
			const result = await axios({
				url: this.getFileContentPath(path),
				headers: this.headers,
				validateStatus: (status =>  status < 500)
			});
			sha = result.data.sha;
		}

		// delete file
		await axios({
			url: this.getFileContentPath(path),
			method: 'DELETE',
			headers: this.headers,
			data: {
				message: 'truncated',
				content: null,
				sha: sha,
			},
			validateStatus: (status =>  status < 500)
		});
		this.logger.debug(`${path} 삭제 완료`);
		return;
	}

	async deleteDirectory(path: string) {
		const files = await this.getFilesInDirectory(path)
		for (const file of files) {
			if (file.type === 'file') {
				await this.deleteFile(file.path, file.sha);
			} else if (file.type === 'dir') {
				// 하위 directory가 있는 경우 재귀적으로 삭제
				await this.deleteDirectory(file.path);
			}
		}
		return;
	}
}



export const githubRepository = new GithubRepository(envManager, githubActionLogger);
