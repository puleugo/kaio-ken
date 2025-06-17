export interface RssResponseDto {
	rss: {
		"@_version": "0.91" | "0.92" | "2.0" | "2.0.1";
		script: {
			"@_src": string;
		}[];
		channel: {
			title: string[];
			link: string[];
			description: string[];
			language: string[];
			pubDate: string[];
			generator: string[];
			ttl: number[];
			managingEditor: string[];
			image: {
				title: string[];
				url: string[];
				link: string[];
			}[];
			item: {
				title: string;
				link: string;
				description: string;
				"content:encoded"?: string;
				category: string;
				author: string;
				guid: string;
				comments: string; // 댓글창 url
				pubDate: string;
			}[];
		};
	};
}
