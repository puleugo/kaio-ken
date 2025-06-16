import type { Dirent } from "node:fs";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { FileSystemFileClient } from "@src/module/repository/driver/file-system.file-client";

jest.mock("node:fs/promises");
jest.mock("node:fs");

describe("FileSystemFileClient", () => {
	let client: FileSystemFileClient;
	const mockedFs = fs as jest.Mocked<typeof fs>;
	const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

	beforeEach(() => {
		client = new FileSystemFileClient();
		jest.clearAllMocks();
	});

	describe("exists", () => {
		it("should return true when file exists", async () => {
			mockedExistsSync.mockReturnValue(true);
			const result = await client.exists("test.txt");
			expect(result).toBe(true);
			expect(mockedExistsSync).toHaveBeenCalledWith("test.txt");
		});

		it("should return false when file does not exist", async () => {
			mockedExistsSync.mockReturnValue(false);
			const result = await client.exists("test.txt");
			expect(result).toBe(false);
			expect(mockedExistsSync).toHaveBeenCalledWith("test.txt");
		});
	});

	describe("find", () => {
		it("should return file content when file exists", async () => {
			const mockBuffer = Buffer.from("test content");
			mockedFs.readFile.mockResolvedValue(mockBuffer);

			const result = await client.find("test.txt");
			expect(result).toEqual(mockBuffer);
			expect(mockedFs.readFile).toHaveBeenCalledWith("test.txt");
		});

		it("should return null when file read fails", async () => {
			mockedFs.readFile.mockResolvedValue("");
			const result = await client.find("test.txt");
			expect(result).toBeNull();
			expect(mockedFs.readFile).toHaveBeenCalledWith("test.txt");
		});
	});

	describe("get", () => {
		it("should return file content", async () => {
			const mockBuffer = Buffer.from("test content");
			mockedFs.readFile.mockResolvedValue(mockBuffer);

			const result = await client.get("test.txt");
			expect(result).toEqual(mockBuffer);
			expect(mockedFs.readFile).toHaveBeenCalledWith("test.txt");
		});

		it("should throw error when file read fails", async () => {
			const error = new Error("File not found");
			mockedFs.readFile.mockRejectedValue(error);

			await expect(client.get("test.txt")).rejects.toThrow(error);
			expect(mockedFs.readFile).toHaveBeenCalledWith("test.txt");
		});
	});

	describe("getFromDirectory", () => {
		it("should return array of file info for files in directory", async () => {
			const mockFiles = [
				{ parentPath: "test-dir", name: "file1.txt", isFile: () => true, isDirectory: () => false } as Dirent,
				{ parentPath: "test-dir", name: "file2.txt", isFile: () => true, isDirectory: () => false } as Dirent,
			];
			const mockBuffer = Buffer.from("test content");

			mockedFs.readdir.mockResolvedValue(mockFiles);
			mockedFs.readFile.mockResolvedValue(mockBuffer);

			const result = await client.getFilesFromDirectory("test-dir");

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				path: "test-dir/file1.txt",
				name: "file1",
				filename: "file1.txt",
				buffer: expect.any(Function),
			});
			expect(result[1]).toEqual({
				path: "test-dir/file2.txt",
				name: "file2",
				filename: "file2.txt",
				buffer: expect.any(Function),
			});

			// Test buffer function
			const buffer1 = await result[0].buffer();
			expect(buffer1).toEqual(mockBuffer);
			expect(mockedFs.readFile).toHaveBeenCalledWith("test-dir/file1.txt");
		});

		it("should filter out non-file entries", async () => {
			mockedFs.readdir.mockImplementation(async (path, { withFileTypes }): Promise<Dirent[]> => {
				if (path === "test-dir") {
					return [
						{ parentPath: "test-dir", name: "file1.txt", isFile: () => true, isDirectory: () => false } as Dirent,
						{ parentPath: "test-dir", name: "dir1", isFile: () => false, isDirectory: () => true } as Dirent,
					];
				}
				if (path === "test-dir/dir1") {
					return [
						{ parentPath: "test-dir/dir1", name: "file2.txt", isFile: () => true, isDirectory: () => false } as Dirent,
					];
				}
				return [];
			});
			mockedFs.readFile.mockResolvedValue(Buffer.from("test content"));

			const result = await client.getFilesFromDirectory("test-dir");

			expect(result).toHaveLength(2);
			expect(result[0].filename).toBe("file1.txt");
			expect(result[1].filename).toBe("file2.txt");
		});

		it("should handle empty directory", async () => {
			mockedFs.readdir.mockResolvedValue([]);

			const result = await client.getFilesFromDirectory("test-dir");

			expect(result).toHaveLength(0);
			expect(mockedFs.readdir).toHaveBeenCalledWith("test-dir", { withFileTypes: true });
		});

		it("should handle readdir error", async () => {
			const error = new Error("Directory not found");
			mockedFs.readdir.mockRejectedValue(error);

			await expect(client.getFilesFromDirectory("test-dir")).rejects.toThrow(error);
			expect(mockedFs.readdir).toHaveBeenCalledWith("test-dir", { withFileTypes: true });
		});
	});
});
