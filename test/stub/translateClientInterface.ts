import {Posts} from "../../src/domain/posts";

export interface TranslateClientInterface {
	translate(posts: Posts): Promise<Posts>;
}
