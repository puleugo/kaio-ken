import { GithubClientImpl } from "@src/module/repository/driver/github-client.impl";
import { FileClientStub } from "@test/stub/file-client.stub";
import { LoggerStub } from "@test/stub/logger.stub";
import { WebClientStub } from "@test/stub/web-client.stub";

describe("GithubClientImpl", () => {
	let githubClient: GithubClientImpl;
	let webClient: WebClientStub;
	let fileClient: FileClientStub;
	let logger: LoggerStub;

	beforeEach(() => {
		webClient = new WebClientStub();
		fileClient = new FileClientStub();
		logger = new LoggerStub();
		githubClient = new GithubClientImpl(
			{
				owner: "test-owner",
				repo: "test-repo",
				token: "test-token",
				branch: "main",
			},
			webClient,
			fileClient,
			logger,
		);
	});

	afterEach(() => {
		webClient.clear();
		fileClient.clear();
	});

	describe("upload", () => {
		it("should upload a single file successfully", async () => {
			// Arrange
			const file = {
				path: "test/file.txt",
				content: Buffer.from("test content"),
				commitMessage: "test commit",
			};

			webClient.pushResponse(200, JSON.stringify({ sha: "test" }));
			webClient.pushResponse(
				201,
				JSON.stringify({
					content: {
						git_url: "https://api.github.com/repos/test-owner/test-repo/git/blobs/123",
						path: "test/file.txt",
						sha: "abc123",
					},
					commit: {
						author: {
							date: "2024-03-20T00:00:00Z",
						},
					},
				}),
			);

			// Act
			const result = await githubClient.upload(file);

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				url: "https://api.github.com/repos/test-owner/test-repo/git/blobs/123",
				path: "test/file.txt",
				sha: "abc123",
				type: "file",
				commitMessage: "test commit",
				uploadedAt: expect.any(Date),
			});

			expect(webClient.methods[0]).toBe("GET");
			expect(webClient.urls[0]).toBe("https://api.github.com/repos/test-owner/test-repo/contents/test/file.txt");

			expect(webClient.methods[1]).toBe("PUT");
			expect(webClient.urls[1]).toBe("https://api.github.com/repos/test-owner/test-repo/contents/test/file.txt");
			expect(webClient.requestBodies[0]).toContain("dGVzdCBjb250ZW50"); // base64 of "test content"
		});
	});

	describe("deleteFile", () => {
		it("should handle file not found when deleting", async () => {
			// Arrange
			const filePath = "test/file.txt";
			webClient.pushResponse(404, "Not Found");

			// Act & Assert
			await expect(githubClient.deleteFile(filePath)).rejects.toThrow("File not found: test/file.txt");
		});
	});

	describe("deleteDirectory", () => {
		it("should delete directory and its contents", async () => {
			// Arrange
			const dirPath = "test/dir";
			const files = [
				{
					path: "test/dir/file1.txt",
					name: "file1.txt",
					filename: "file1",
					buffer: async () => Buffer.from("content1"),
				},
				{
					path: "test/dir/file2.txt",
					name: "file2.txt",
					filename: "file2",
					buffer: async () => Buffer.from("content2"),
				},
			];

			fileClient.setFile(...files);
			webClient.pushResponse(200, "OK");
			webClient.pushResponse(201, "OK");

			// Act
			await githubClient.deleteDirectory(dirPath);

			// Assert
			expect(webClient.methods).toHaveLength(2);
			expect(webClient.methods[0]).toBe("DELETE");
			expect(webClient.methods[1]).toBe("DELETE");
			expect(webClient.urls[0]).toBe("https://api.github.com/repos/test-owner/test-repo/contents/test/dir/file1.txt");
			expect(webClient.urls[1]).toBe("https://api.github.com/repos/test-owner/test-repo/contents/test/dir/file2.txt");
		});
	});
});
