import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Utility class for date manipulation and formatting.
 * Do not use JS Date object directly. that contains many issues(timezone, readability etc.).
 */
export const DateUtil = {
	min(): Date {
		return dayjs.utc(new Date(-8640000000000000)).toDate();
	},
	minFormatYYYYMMDD(): string {
		return dayjs.utc(new Date(-8640000000000000)).format("YYYY-MM-DD");
	},
	max(): Date {
		return dayjs.utc(new Date(8640000000000000)).toDate();
	},
	formatYYYYMMDD(date: Date): string {
		return dayjs.utc(date).format("YYYY-MM-DD");
	},
	now(): Date {
		return dayjs(new Date()).toDate();
	},
	nowFormatYYYYMMDD(): string {
		return dayjs.utc(new Date()).format("YYYY-MM-DD");
	},

	isYYYYMMDD(date: string): boolean {
		return dayjs(date, "YYYY-MM-DD", true).isValid();
	},
	fromYYYYMMDD(lastPublishedAt: string): Date {
		if (!this.isYYYYMMDD(lastPublishedAt)) {
			throw new Error(`Invalid date string: ${lastPublishedAt}`);
		}
		return dayjs.utc(lastPublishedAt).toDate();
	},
	isSameDate(date1: Date, date2: Date): boolean {
		return dayjs.utc(date1).isSame(dayjs.utc(date2));
	},

	fromString(text: string): Date {
		const isISOFormat = /T|\d{2}:\d{2}/.test(text);

		const date = isISOFormat
			? dayjs.utc(text) // ISO 포맷은 UTC로
			: dayjs(text, "YYYY-MM-DD", true);

		if (!date.isValid()) {
			throw new Error(`Invalid date string: ${text}`);
		}

		return date.toDate();
	},
	fromDate(date: Date) {
		return dayjs.utc(date).toDate();
	},
};
