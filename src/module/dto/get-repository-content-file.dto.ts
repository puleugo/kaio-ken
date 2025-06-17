/**
 * @see https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
 */
export class GetRepositoryContentFileDto {
	type: string;
	encoding: string;
	size: number;
	name: string;
	path: string;
	content: string;
	sha: string;
	url: string;
	git_url: string;
	html_url: string;
	download_url: string;
	_links: {
		git: string;
		self: string;
		html: string;
	};
}
