import { fakerKO } from "@faker-js/faker";
export class RssMother {
    static createTistoryPosts() {
        const dates = fakerKO.date.betweens({
            from: fakerKO.date.past(),
            to: fakerKO.date.recent(),
            count: {
                min: 5,
                max: 15,
            },
        });
        return {
            script: "script",
            channel: {
                title: [fakerKO.lorem.words(3)],
                link: [fakerKO.internet.url()],
                description: [fakerKO.lorem.words(10)],
                language: ['ko'],
                pubDate: [fakerKO.date.recent().toISOString()],
                generator: ['TISTORY'],
                ttl: [100],
                managingEditor: [fakerKO.person.fullName()],
                image: [
                    {
                        title: [fakerKO.lorem.words(3)],
                        url: [fakerKO.image.url()],
                        link: [fakerKO.internet.url()]
                    }
                ],
                item: dates.map(date => this.createTistoryPost({ pubDate: date }))
            }
        };
    }
    static createTistoryPost(props) {
        return {
            title: fakerKO.lorem.words(3),
            link: fakerKO.internet.url(),
            description: fakerKO.lorem.words(10),
            category: fakerKO.lorem.words(3),
            author: fakerKO.person.fullName(),
            guid: fakerKO.internet.url(),
            comments: fakerKO.internet.url(),
            pubDate: props?.pubDate?.toISOString() || fakerKO.date.recent().toISOString(),
        };
    }
}
