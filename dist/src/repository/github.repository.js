import axios from "axios";
import { envValidator } from "../util/validator/env-validator.js";
export class GithubRepository {
    envValidator;
    config;
    referenceUrl;
    commitUrl;
    treeUrl;
    headers;
    MODES = { FILE: '100644', FOLDER: '040000' };
    TYPE = { BLOB: 'blob', TREE: 'tree' };
    constructor(envValidator) {
        this.envValidator = envValidator;
        this.config = {
            owner: this.envValidator.getOrThrow('GH_OWNER'),
            repo: this.envValidator.getOrThrow('GH_REPOSITORY'),
            auth: this.envValidator.getOrThrow('GH_TOKEN'),
            branch: 'main',
        };
        this.referenceUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch}`;
        this.commitUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/commits`;
        this.treeUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/git/trees`;
        this.headers = {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${this.config.auth}`,
        };
    }
    async uploadPosts(newPosts) {
        if (newPosts.length === 0)
            return newPosts;
        const updateData = newPosts.subscribeFiles;
        const { data: { object: { sha: currentCommitSha } } } = await axios({ url: this.referenceUrl, headers: this.headers });
        const currentCommitUrl = `${this.commitUrl}/${currentCommitSha}`;
        const { data: { tree: { sha: treeSha } } } = await axios({ url: currentCommitUrl, headers: this.headers });
        const { data: { sha: newTreeSha } } = await axios({
            url: this.treeUrl,
            method: 'POST',
            headers: this.headers,
            data: {
                base_tree: treeSha,
                tree: updateData
                    .map(({ content, path }) => (content
                    ? { path, content, mode: this.MODES.FILE, type: this.TYPE.BLOB } // Works for text files, utf-8 assumed
                    : { path, sha: null, mode: this.MODES.FILE, type: this.TYPE.BLOB } // If sha is null => the file gets deleted
                )),
            },
        });
        const { data: { sha: newCommitSha } } = await axios({
            url: this.commitUrl,
            method: 'POST',
            headers: this.headers,
            data: {
                message: 'Committing with GitHub\'s API :fire:',
                tree: newTreeSha,
                parents: [currentCommitSha],
            },
        });
        // Make BRANCH_NAME point to the created commit
        await axios({
            url: this.referenceUrl,
            method: 'POST',
            headers: this.headers,
            data: { sha: newCommitSha },
        });
        return newPosts;
    }
}
export const githubClient = new GithubRepository(envValidator);
