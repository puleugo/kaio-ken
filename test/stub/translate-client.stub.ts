import { Posts } from "../../src/domain/posts";
import {TranslateClientInterface} from "./translateClientInterface";

export class TranslateClientStub implements TranslateClientInterface {
    translate(posts: Posts): Promise<Posts> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
