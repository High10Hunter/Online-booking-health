import ScheduleServices from '../../services/admin/ScheduleServices';
import { StatusCodes } from 'http-status-codes';
import DoctorServices from '../../services/admin/DoctorServices';
import moment from 'moment';

const index = async (req, res) => {
	try {
		const { id } = req.params;
		const doctor = await DoctorServices.getDoctorById(id);

		res.render('admin/schedules/details', {
			title: 'Quản lý lịch khám',
			doctor_id: req.params.id,
			doctor_name: doctor.user.name,
			doctor_rank: doctor.getRankName(),
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get doctor',
			doctor: null,
		});
	}
};

const getScheduleOfDoctor = async (req, res) => {
	try {
		const { id } = req.params;
		const schedules = await ScheduleServices.getScheduleOfDoctor(id);

		//convert schedule to array of object
		const data = [];
		for (let i = 0; i < schedules.length; i++) {
			data.push({
				id: schedules[i].id,
				title: 'Lịch khám',
				start: schedules[i].start_time,
				end: schedules[i].end_time,
				//check whether date is in the past
				color: moment(schedules[i].start_time).isBefore(moment())
					? '#f84e4e'
					: '#2890f6',
				extendedProps: {
					startTime: schedules[i].start_time
						.split('T')[1]
						.slice(0, 5),
					endTime: schedules[i].end_time.split('T')[1].slice(0, 5),
				},
			});
		}

		return res.send(data);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get schedule of doctor',
			schedules: [],
		});
	}
};

const getTodaySchedule = async (req, res) => {
	try {
		const today = moment().format('YYYY-MM-DD');

		const schedules = await ScheduleServices.getScheduleOfDoctorByDate(
			today
		);

		//convert schedule to array of object
		const data = [];
		for (let i = 0; i < schedules.length; i++) {
			data.push({
				id: schedules[i].id,
				title:
					schedules[i].doctor.rank + ' - ' + schedules[i].doctor.name,
				start: schedules[i].start_time,
				end: schedules[i].end_time,
				//check whether date is in the past
				color: moment(schedules[i].start_time).isBefore(moment())
					? '#f84e4e'
					: '#2890f6',
				extendedProps: {
					startTime: schedules[i].start_time
						.split('T')[1]
						.slice(0, 5),
					endTime: schedules[i].end_time.split('T')[1].slice(0, 5),
					doctor:
						schedules[i].doctor.rank +
						' - ' +
						schedules[i].doctor.name,
				},
			});
		}

		return res.send(data);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get today schedule',
		});
	}
};

const create = async (req, res) => {
	const { doctor_id, date, start_time } = req.body;

	try {
		const schedule = await ScheduleServices.createSchedule(
			doctor_id,
			date,
			start_time
		);

		return res.status(StatusCodes.OK).json({
			message: 'success',
			data: schedule,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot create schedule',
			data: [],
		});
	}
};

const destroy = async (req, res) => {
	try {
		const { id } = req.params;
		const { date } = req.body;
		const schedule = await ScheduleServices.getScheduleById(id);

		if (!schedule) {
			throw new Error('Schedule not found');
		}

		await ScheduleServices.deleteSchedule(id, date);

		return res.status(StatusCodes.OK).json({
			message: 'success',
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot delete schedule',
			data: [],
		});
	}
};

export default {
	index,
	create,
	destroy,
	getScheduleOfDoctor,
	getTodaySchedule,
};
