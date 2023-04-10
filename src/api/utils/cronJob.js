import cron from 'node-cron';
import ScheduleServices from '../services/admin/ScheduleServices';
import AppointmentServices from '../services/client/AppointmentServices';

// schedule to run every week on saturday at 12:00 pm
const createScheduleCronJob = () => {
	cron.schedule('0 12 * * 6', async () => {
		await ScheduleServices.createScheduleEachWeek();
	});
};

// schedule to run every 10 minutes
const deleteUnconfirmedAppointmentCronJob = () => {
	cron.schedule('*/10 * * * *', async () => {
		await AppointmentServices.deleteUnconfirmedAppointment();
	});
};

module.exports = { createScheduleCronJob, deleteUnconfirmedAppointmentCronJob };
