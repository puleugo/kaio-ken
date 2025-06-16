import { Result } from "../../core/result";
import type { BlogPlatform } from "../domain/blog-platform";
import type { Translation } from "../domain/translation";
import type { Translations } from "../domain/translations";
import type { WebClient } from "../repository/web.client";

export abstract class BlogPlatformUploader {
	private static strategy: Map<string, BlogPlatformUploader> = new Map();
	protected readonly client: WebClient;

	protected constructor(client: WebClient) {
		this.client = client;
	}

	/**
	 * Register a new uploader for a specific blog platform.
	 * @example
	 * @param platform
	 * @param instance
	 */
	static register(platform: BlogPlatform, instance: BlogPlatformUploader): void {
		const platformKey = platform.toString();
		if (BlogPlatformUploader.strategy.has(platformKey)) {
			throw new Error(`Platform ${platform} is already registered`);
		}
		BlogPlatformUploader.strategy.set(platformKey, instance);
	}

	static get(platform: BlogPlatform): Result<BlogPlatformUploader> {
		const instance = BlogPlatformUploader.strategy.get(platform.toString());
		if (!instance) return Result.fail(`Platform ${platform} is not registered`);

		return Result.success(instance);
	}

	abstract putUpload(posts: Translation): Promise<Translation>;

	async uploadAll(posts: Translations): Promise<void> {
		await Promise.all(posts.getAll().map((post) => this.putUpload(post)));
	}
}
