export const StringUtil = {
	parseNumberWithCommas(number: number): string {
		if (Number.isNaN(number)) {
			throw new Error("Invalid number");
		}
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
};
