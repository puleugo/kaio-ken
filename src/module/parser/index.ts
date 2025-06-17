import { BlogPlatform } from "../domain/blog-platform";
import { TistoryRssParser } from "./rss-parser-strategy/tistory-rss-parser";
import { WordpressRssParser } from "./rss-parser-strategy/wordpress-rss-parser";
import { RssParser } from "./rss.parser";

RssParser.register(BlogPlatform.values.wordpress, new WordpressRssParser());
RssParser.register(BlogPlatform.values.tistory, new TistoryRssParser());
