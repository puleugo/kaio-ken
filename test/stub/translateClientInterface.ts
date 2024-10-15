import {Posts} from "../../src/domain/posts.js";

export interface TranslateClientInterface {
	translate(posts: Posts): Promise<Posts>;
}
