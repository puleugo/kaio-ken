export interface RssResponse {
	script: string;
	channel: BlogRssResponse;
}

interface BlogerProfileImage {
	title: string[];
	url: string[];
	link: string[];
}

interface BlogRssResponse {
	title: string[];
	link: string[];
	description: string[];
	language: string[];
	pubDate: string[];
	generator: string[];
	ttl: number[];
	managingEditor: string[];
	image: BlogerProfileImage[]
	item: PostRssResponse[];
}

interface PostRssResponse {
	title: string;
	link: string;
	description: string;
	category: string;
	author: string;
	guid: string;
	comments: string; // 댓글창 url
	pubDate: string;
}

export enum BlogPlatformEnum {
	Tistory = 'Tistory', // 한국 대표격1
	Velog = 'Velog', // 한국 대표격2
	Qiita = 'Qiita', // 일본 대표격
	Medium = 'Medium', // 영어 대표격
}

export enum HrefTagEnum {
	Afrikaans = 'af',
	Albanian = 'sq',
	Arabic = 'ar',
	Armenian = 'hy',
	Assamese = 'as',
	Azerbaijani = 'az',
	Basque = 'eu',
	Belarusian = 'bel',
	Bengali_Bangladesh = 'bn-BD',
	Bosnian = 'bs-BA',
	Bulgarian = 'bg-BG',
	Catalan = 'ca',
	Cebuano = 'ceb',
	Chinese_China = 'zh-CN',
	Chinese_HongKong = 'zh-HK',
	Chinese_Simplified = 'zh-Hans',
	Chinese_Taiwan = 'zh-TW',
	Chinese_Traditional = 'zh-Hant',
	Croatian = 'hr',
	Czech = 'cs',
	Czech_Czechia = 'cs-CZ',
	Danish = 'da-DK',
	Dutch = 'nl',
	Dutch_Belgium = 'nl-BE',
	Dutch_Netherlands = 'nl-NL',
	Dzongkha = 'dzo',
	English = 'en',
	English_Australia = 'en-AU',
	English_Belgium = 'en-BE',
	English_Canada = 'en-CA',
	English_China = 'en-CN',
	English_HongKong = 'en-HK',
	English_India = 'en-IN',
	English_Indonesia = 'en-ID',
	English_Ireland = 'en-IE',
	English_Malaysia = 'en-MY',
	English_Myanmar = 'en-MM',
	English_Netherlands = 'en-NL',
	English_NewZealand = 'en-NZ',
	English_Philippines = 'en-PH',
	English_Romania = 'en-RO',
	English_Singapore = 'en-SG',
	English_SouthAfrica = 'en-ZA',
	English_Switzerland = 'en-CH',
	English_Thailand = 'en-TH',
	English_UK = 'en-GB',
	English_UnitedArabEmirates = 'en-AE',
	English_UnitedStates = 'en-US',
	Esperanto = 'eo',
	Estonian = 'et',
	Finnish = 'fi',
	French = 'fr',
	French_Belgium = 'fr-BE',
	French_Canada = 'fr-CA',
	French_France = 'fr-FR',
	French_Luxembourg = 'fr-LU',
	French_Switzerland = 'fr-CH',
	Friulian = 'fur',
	Galician = 'gl-ES',
	Georgian = 'ka-GE',
	German_Austria = 'de-AT',
	German_DE = 'de',
	German_Germany = 'de-DE',
	German_Switzerland = 'de-CH',
	Greek = 'el',
	Gujarati = 'gu',
	Hazaragi = 'haz',
	Hebrew = 'he-IL',
	Hindi = 'hi-IN',
	Hungarian = 'hu-HU',
	Icelandic = 'is-IS',
	Indonesian = 'id-ID',
	Italian = 'it',
	Italian_Italy = 'it-IT',
	Japanese = 'ja',
	Javanese = 'jv-ID',
	Kabyle = 'kab',
	Kannada = 'kn',
	Kazakh = 'kk',
	Khmer = 'km',
	Korean = 'ko-KR',
	Kurdish_Sorani = 'ckb',
	Lao = 'lo',
	Latvian = 'lv',
	Lithuanian = 'lt-LT',
	Macedonian = 'mk-MK',
	Malay = 'ms-MY',
	Malayalam = 'ml-IN',
	Marathi = 'mr',
	Mongolian = 'mn',
	MoroccanArabic = 'ary',
	Myanmar_Burmese = 'my-MM',
	Nepali = 'ne-NP',
	Norwegian = 'no-NO',
	Norwegian_Bokmål = 'nb-NO',
	Norwegian_Default = 'no',
	Norwegian_Nynorsk = 'nn-NO',
	Occitan = 'oci',
	Pashto = 'ps',
	Persian = 'fa-IR',
	Polish = 'pl',
	Polish_Poland = 'pl-PL',
	Portuguese = 'pt',
	Portuguese_Angola = 'pt-AO',
	Portuguese_Brazil = 'pt-BR',
	Portuguese_Portugal = 'pt-PT',
	Punjabi = 'pa-IN',
	Rohingya = 'rhg',
	Romanian = 'ro-RO',
	Russian = 'ru',
	Russian_Russia = 'ru-RU',
	Sakha = 'sah',
	Saraiki = 'skr',
	ScottishGaelic = 'gd',
	Serbian = 'sr-RS',
	Silesian = 'szl',
	Sinhala = 'si-LK',
	Slovak = 'sk-SK',
	Slovenian = 'sl-SI',
	SouthAzerbaijani = 'azb',
	Spanish = 'es',
	Spanish_Argentina = 'es-AR',
	Spanish_Chile = 'es-CL',
	Spanish_Colombia = 'es-CO',
	Spanish_CostaRica = 'es-CR',
	Spanish_Guatemala = 'es-GT',
	Spanish_Mexico = 'es-MX',
	Spanish_Peru = 'es-PE',
	Spanish_Spain = 'es-ES',
	Spanish_Venezuela = 'es-VE',
	Swedish = 'sv',
	Swedish_Sweden = 'sv-SE',
	Tagalog = 'tl',
	Tahitian = 'tah',
	Tajik = 'tg',
	Tamil = 'ta-IN',
	Tatar = 'tt-RU',
	Telugu = 'te',
	Thai = 'th',
	Tibetan = 'bo',
	Turkish = 'tr',
	Turkish_Turkey = 'tr-TR',
	Turkmen = 'tk',
	Uighur = 'ug-CN',
	Ukrainian = 'uk',
	Urdu = 'ur',
	Uzbek = 'uz',
	Uzbe_zbekistan = 'uz-UZ',
	Vietnamese = 'vi',
	Welsh = 'cy'
}

export function isHrefTageEnum(arg: any): arg is HrefTagEnum {
	if (!arg) return false;
	return (!!arg && typeof arg === 'string' && (Object.keys(HrefTagEnum) as string[]).includes(arg))
}

export function isBlogPlatformEnum(arg: any): arg is BlogPlatformEnum {
	if (!arg) return false;
	return (!!arg && typeof arg === 'string' && (Object.keys(BlogPlatformEnum) as string[]).includes(arg))
}
