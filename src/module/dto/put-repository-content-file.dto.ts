/**
 * @see https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
 */
export class PutRepositoryContentFileDto {
	content: {
		name: string;
		path: string;
		sha: string;
		size: number;
		url: string;
		html_url: string;
		git_url: string;
		download_url: string;
		type: string;
		_links: {
			self: string;
			git: string;
			html: string;
		};
	};
	commit: {
		sha: string;
		node_id: string;
		url: string;
		html_url: string;
		author: {
			date: string;
			name: string;
			email: string;
		};
		committer: {
			date: string;
			name: string;
			email: string;
		};
		message: string;
		tree: {
			url: string;
			sha: string;
		};
		parents: [
			{
				url: string;
				html_url: string;
				sha: string;
			},
		];
		verification: {
			verified: boolean;
			reason: string;
			signature: null;
			payload: null;
			verified_at: null;
		};
	};
}
