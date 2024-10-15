import html2md from 'html-to-md';
export class PostEntity {
    index;
    title;
    content;
    uploadedAt;
    hasUploadedOnGithub = false;
    githubUrl = null;
    originUrl;
    language;
    get toValue() {
        return {
            values: [
                [this.title, this.content, this.uploadedAt.toISOString(), this.hasUploadedOnGithub, this.githubUrl, this.originUrl, this.language]
            ]
        };
    }
    ;
    constructor(props, index) {
        this.index = index;
        this.title = props.title;
        this.content = html2md(props.content);
        this.uploadedAt = new Date(props.uploadedAt);
        this.originUrl = props.originUrl;
        this.language = props.language;
    }
}
