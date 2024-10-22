import {Posts} from "../../src/domain/posts";

export interface PostWriteClientInterface {
	readPostFromSpreadSheet(): Promise<Posts>;

	upload(posts: Posts): Promise<void>;
}
