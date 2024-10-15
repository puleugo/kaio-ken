import { Posts } from "../../src/domain/posts.js";
import {TranslateClientInterface} from "./translateClientInterface.js";

export class TranslateClientStub implements TranslateClientInterface {
    translate(posts: Posts): Promise<Posts> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
