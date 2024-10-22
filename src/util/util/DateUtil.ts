import dayjs from "dayjs";

export class DateUtil {
	static get min(): Date {
		return dayjs(new Date(-8640000000000000)).toDate();
	}

	static get minFormatYYYYMMDD(): string {
		return dayjs(new Date(-8640000000000000)).format("YYYY-MM-DD");
	}

	static get max(): Date {
		return dayjs(new Date(8640000000000000)).toDate();
	}

	static formatYYYYMMDD(date: Date): string {
		return dayjs(date).format("YYYY-MM-DD");
	}

	static get nowFormatYYYYMMDD(): string {
		return dayjs(new Date()).format("YYYY-MM-DD");
	}
}
