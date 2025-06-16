export interface RssPostDto {
	title: string;
	link: string;
	description: string;
	guid: string;
	pubDate: Date;
	author?: string;
	category?: string;
}
