import { Result } from "../../core/result";
import { ValueObject } from "../../core/value-object";

const languageMap = {
	af: "Afrikaans",
	sq: "Albanian",
	ar: "Arabic",
	hy: "Armenian",
	as: "Assamese",
	az: "Azerbaijani",
	eu: "Basque",
	bel: "Belarusian",
	"bn-BD": "Bengali_Bangladesh",
	"bs-BA": "Bosnian",
	"bg-BG": "Bulgarian",
	ca: "Catalan",
	ceb: "Cebuano",
	"zh-CN": "Chinese_China",
	"zh-HK": "Chinese_HongKong",
	"zh-Hans": "Chinese_Simplified",
	"zh-TW": "Chinese_Taiwan",
	"zh-Hant": "Chinese_Traditional",
	hr: "Croatian",
	cs: "Czech",
	"cs-CZ": "Czech_Czechia",
	"da-DK": "Danish",
	nl: "Dutch",
	"nl-BE": "Dutch_Belgium",
	"nl-NL": "Dutch_Netherlands",
	dzo: "Dzongkha",
	en: "English",
	"en-AU": "English_Australia",
	"en-BE": "English_Belgium",
	"en-CA": "English_Canada",
	"en-CN": "English_China",
	"en-HK": "English_HongKong",
	"en-IN": "English_India",
	"en-ID": "English_Indonesia",
	"en-IE": "English_Ireland",
	"en-MY": "English_Malaysia",
	"en-MM": "English_Myanmar",
	"en-NL": "English_Netherlands",
	"en-NZ": "English_NewZealand",
	"en-PH": "English_Philippines",
	"en-RO": "English_Romania",
	"en-SG": "English_Singapore",
	"en-ZA": "English_SouthAfrica",
	"en-CH": "English_Switzerland",
	"en-TH": "English_Thailand",
	"en-GB": "English_UK",
	"en-AE": "English_UnitedArabEmirates",
	"en-US": "English_UnitedStates",
	eo: "Esperanto",
	et: "Estonian",
	fi: "Finnish",
	fr: "French",
	"fr-BE": "French_Belgium",
	"fr-CA": "French_Canada",
	"fr-FR": "French_France",
	"fr-LU": "French_Luxembourg",
	"fr-CH": "French_Switzerland",
	fur: "Friulian",
	"gl-ES": "Galician",
	"ka-GE": "Georgian",
	"de-AT": "German_Austria",
	de: "German_DE",
	"de-DE": "German_Germany",
	"de-CH": "German_Switzerland",
	el: "Greek",
	gu: "Gujarati",
	haz: "Hazaragi",
	"he-IL": "Hebrew",
	"hi-IN": "Hindi",
	"hu-HU": "Hungarian",
	"is-IS": "Icelandic",
	"id-ID": "Indonesian",
	it: "Italian",
	"it-IT": "Italian_Italy",
	ja: "Japanese",
	"jv-ID": "Javanese",
	kab: "Kabyle",
	kn: "Kannada",
	kk: "Kazakh",
	km: "Khmer",
	"ko-KR": "Korean",
	ckb: "Kurdish_Sorani",
	lo: "Lao",
	lv: "Latvian",
	"lt-LT": "Lithuanian",
	"mk-MK": "Macedonian",
	"ms-MY": "Malay",
	"ml-IN": "Malayalam",
	mr: "Marathi",
	mn: "Mongolian",
	ary: "MoroccanArabic",
	"my-MM": "Myanmar_Burmese",
	"ne-NP": "Nepali",
	"no-NO": "Norwegian",
	"nb-NO": "Norwegian_Bokmål",
	no: "Norwegian_Default",
	"nn-NO": "Norwegian_Nynorsk",
	oci: "Occitan",
	ps: "Pashto",
	"fa-IR": "Persian",
	pl: "Polish",
	"pl-PL": "Polish_Poland",
	pt: "Portuguese",
	"pt-AO": "Portuguese_Angola",
	"pt-BR": "Portuguese_Brazil",
	"pt-PT": "Portuguese_Portugal",
	"pa-IN": "Punjabi",
	rhg: "Rohingya",
	"ro-RO": "Romanian",
	ru: "Russian",
	"ru-RU": "Russian_Russia",
	sah: "Sakha",
	skr: "Saraiki",
	gd: "ScottishGaelic",
	"sr-RS": "Serbian",
	szl: "Silesian",
	"si-LK": "Sinhala",
	"sk-SK": "Slovak",
	"sl-SI": "Slovenian",
	azb: "SouthAzerbaijani",
	es: "Spanish",
	"es-AR": "Spanish_Argentina",
	"es-CL": "Spanish_Chile",
	"es-CO": "Spanish_Colombia",
	"es-CR": "Spanish_CostaRica",
	"es-GT": "Spanish_Guatemala",
	"es-MX": "Spanish_Mexico",
	"es-PE": "Spanish_Peru",
	"es-ES": "Spanish_Spain",
	"es-VE": "Spanish_Venezuela",
	sv: "Swedish",
	"sv-SE": "Swedish_Sweden",
	tl: "Tagalog",
	tah: "Tahitian",
	tg: "Tajik",
	"ta-IN": "Tamil",
	"tt-RU": "Tatar",
	te: "Telugu",
	th: "Thai",
	bo: "Tibetan",
	tr: "Turkish",
	"tr-TR": "Turkish_Turkey",
	tk: "Turkmen",
	"ug-CN": "Uighur",
	uk: "Ukrainian",
	ur: "Urdu",
	uz: "Uzbek",
	"uz-UZ": "Uzbe_zbekistan",
	vi: "Vietnamese",
	cy: "Welsh",
} as const;

type LanguageMap = typeof languageMap;
type LanguageSlug = LanguageMap[keyof LanguageMap];

interface LanguageProperties {
	value: string;
}

export class Language extends ValueObject<LanguageProperties> {
	static readonly NOT_VALID_HREF_CODE = "Not valid href code";

	static readonly values = Object.entries(languageMap).reduce(
		(acc, [code, name]) => {
			acc[name] = new Language({ value: code });
			return acc;
		},
		{} as Record<LanguageSlug, Language>,
	);

	private constructor(props: { value: string }) {
		super(props);
	}

	toString(): string {
		return this.props.value;
	}

	private static isValid(code: string): boolean {
		return Object.keys(languageMap).includes(code);
	}

	static from(code: string): Result<Language> {
		if (!Language.isValid(code)) return Result.fail(Language.NOT_VALID_HREF_CODE);
		return Result.success(new Language({ value: code }));
	}
}
