import type { GetRepositoryContentFileDto } from "@src/module/dto/get-repository-content-file.dto";
import type { PutRepositoryContentFileDto } from "@src/module/dto/put-repository-content-file.dto";

export namespace GithubResponseMother {
	export function createGetResponse(): GetRepositoryContentFileDto {
		return {
			type: "file",
			encoding: "base64",
			size: 1234,
			name: "example.md",
			path: "content/example.md",
			content: "SGVsbG8sIFdvcmxkIQ==", // Base64 encoded content
			sha: "abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
			url: "https://api.github.com/repos/owner/repo/contents/content/example.md",
			git_url:
				"https://api.github.com/repos/owner/repo/git/blobs/abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
			html_url: "",
			download_url: "https://raw.githubusercontent.com/owner/repo/branch/content/example.md",
			_links: {
				git: "https://api.github.com/repos/owner/repo/git/blobs/abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
				self: "https://api.github.com/repos/owner/repo/contents/content/example.md",
				html: "",
			},
		};
	}
	export function createGetResponseJson(): string {
		return JSON.stringify(createGetResponse());
	}

	export function createPutResponse(): PutRepositoryContentFileDto {
		return {
			content: {
				name: "example.md",
				path: "content/example.md",
				sha: "abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
				size: 1234,
				url: "https://api.github.com/repos/owner/repo/contents/content/example.md",
				html_url: "",
				git_url:
					"https://api.github.com/repos/owner/repo/git/blobs/abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
				download_url: "https://raw.githubusercontent.com/owner/repo/branch/content/example.md",
				type: "file",
				_links: {
					self: "https://api.github.com/repos/owner/repo/contents/content/example.md",
					git: "https://api.github.com/repos/owner/repo/git/blobs/abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
					html: "",
				},
			},
			commit: {
				sha: "abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
				node_id: "MDY6Q29tbWl0MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkw",
				url: "https://api.github.com/repos/owner/repo/git/commits/abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
				html_url: "",
				author: {
					date: "2023-10-01T12:00:00Z",
					name: "Author Name",
					email: "",
				},
				committer: {
					date: "2023-10-01T12:00:00Z",
					name: "Committer Name",
					email: "",
				},
				message: "Update example.md",
				tree: {
					url: "https://api.github.com/repos/owner/repo/git/trees/abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
					sha: "abc123def456ghi789jkl012mno345pqrs678tuv901wxyz234567890",
				},
				parents: [
					{
						url: "https://api.github.com/repos/owner/repo/git/commits/previous_commit_sha",
						html_url: "",
						sha: "previous_commit_sha",
					},
				],
				verification: {
					verified: true,
					reason: "valid",
					signature: null,
					payload: null,
					verified_at: null,
				},
			},
		};
	}
	export function createPutResponseJson(): string {
		return JSON.stringify(createPutResponse());
	}
}
