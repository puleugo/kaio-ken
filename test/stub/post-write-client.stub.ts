import { Posts } from "../../src/domain/posts.js";
import {PostWriteClientInterface} from "./postWriteClientInterface.js";

export class PostWriteClientStub implements PostWriteClientInterface {
    readPostFromSpreadSheet(): Promise<Posts> {
        throw new Error("Method not implemented.");
    }
    upload(posts: Posts): Promise<void> {
        throw new Error("Method not implemented.");
    }

	reset() {

	}
}
