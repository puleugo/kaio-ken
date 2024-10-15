import { PostEntity } from "../../src/domain/postEntity.js";
import { HrefTagEnum } from "../../src/type.js";
export class PostMother {
    static create() {
        return new PostEntity({
            title: 'title',
            content: 'content',
            uploadedAt: '2021-01-01',
            hasUploadedOnGithub: false,
            originUrl: 'originUrl',
            language: HrefTagEnum.Korean,
        }, 1);
    }
    ;
    static createMany(time = 3) {
        return Array.from({ length: time }, () => PostMother.create());
    }
}
