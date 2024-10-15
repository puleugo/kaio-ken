import {Posts} from "../../src/domain/posts.js";

export interface PostWriteClientInterface {
	readPostFromSpreadSheet(): Promise<Posts>;

	upload(posts: Posts): Promise<void>;
}
