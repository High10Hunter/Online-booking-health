import cron from 'node-cron';
import ScheduleServices from '../services/admin/ScheduleServices';

//schedule to run every week on saturday at 12:00 pm
const cronJob = () => {
	cron.schedule('0 12 * * 6', async () => {
		await ScheduleServices.createScheduleEachWeek();
	});
};

module.exports = { cronJob };
