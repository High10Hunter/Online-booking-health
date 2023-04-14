const getDatesRange = () => {
	const today = new Date();
	const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
	const dates = [];

	for (let date = today; date <= nextWeek; date.setDate(date.getDate() + 1)) {
		// format date to YYYY-MM-DD
		dates.push(date.toISOString().slice(0, 10));
	}

	return dates;
};

module.exports = {
	getDatesRange,
};
