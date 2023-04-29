import { Schedule, Shift, Doctor, User, Appointment } from '../../models';
import { Op } from 'sequelize';
import moment from 'moment';

const getScheduleById = async id => {
	try {
		const schedule = await Schedule.findByPk(id);

		return schedule;
	} catch (error) {
		throw new Error(error.message || 'Cannot get schedule by id');
	}
};

const getScheduleOfDoctor = async doctorId => {
	try {
		const data = await Schedule.findAll({
			where: {
				doctor_id: doctorId,
			},
			include: [
				{
					model: Shift,
					as: 'shift',
					attributes: ['start_time', 'end_time'],
					required: false,
					subQuery: false,
				},
			],
			attributes: ['id', 'date'],
		});

		let schedules = [];
		data.forEach(item => {
			//ex: date: 2023-01-01, start_time: 08:00:00
			// => 2023-01-01T08:00:00
			schedules.push({
				id: item.id,
				start_time: item.date + 'T' + item.shift.start_time,
				end_time: item.date + 'T' + item.shift.end_time,
			});
		});

		return schedules;
	} catch (error) {
		throw new Error("Can't get schedules");
	}
};

const getScheduleOfDoctorByDate = async date => {
	try {
		const data = await Schedule.findAll({
			where: {
				date: date,
			},
			include: [
				{
					model: Shift,
					as: 'shift',
					attributes: ['start_time', 'end_time'],
					required: false,
					subQuery: false,
				},
				{
					model: Doctor,
					as: 'doctor',
					attributes: ['id', 'rank'],
					required: false,
					subQuery: false,
					include: [
						{
							model: User,
							as: 'user',
							attributes: ['name'],
							required: false,
							subQuery: false,
						},
					],
				},
			],
			attributes: ['id', 'date'],
		});

		let schedules = [];
		data.forEach(item => {
			//ex: date: 2023-01-01, start_time: 08:00:00
			// => 2023-01-01T08:00:00
			schedules.push({
				id: item.id,
				start_time: item.date + 'T' + item.shift.start_time,
				end_time: item.date + 'T' + item.shift.end_time,
				doctor: {
					name: item.doctor.user.name,
					rank: item.doctor.getRankName(),
				},
			});
		});

		return schedules;
	} catch (error) {
		throw new Error(error.message || "Can't get schedules");
	}
};

const createSchedule = async (doctorId, date, start_time) => {
	try {
		// check if date is today
		if (moment(date).isSame(moment().format('YYYY-MM-DD'))) {
			//check if start time today is in the past with HH:mm format
			if (moment(start_time, 'HH:mm').isBefore(moment())) {
				throw new Error('Start time is in the past');
			}
		}

		//check if date is in the past with YYYY-MM-DD format
		if (moment(date).isBefore(moment().format('YYYY-MM-DD'))) {
			throw new Error('Date is in the past');
		}

		//check if the date is in the current week or the next week
		if (
			!moment(date).isBetween(
				moment().startOf('week').format('YYYY-MM-DD'),
				moment().add(1, 'week').endOf('week').format('YYYY-MM-DD')
			)
		) {
			throw new Error('Date is not in the current week or the next week');
		}

		const shift = await Shift.findOne({
			where: {
				start_time: start_time,
			},
			attributes: ['id'],
		});

		if (!shift) {
			throw new Error('Shift not found');
		} else {
			const schedule = await Schedule.findOne({
				where: {
					doctor_id: doctorId,
					date: date,
					shift_id: shift.id,
				},
			});

			if (schedule) {
				throw new Error('Schedule already exists');
			} else {
				const data = await Schedule.create({
					doctor_id: doctorId,
					date: date,
					shift_id: shift.id,
				});

				return data;
			}
		}
	} catch (error) {
		throw new Error(error.message);
	}
};

const createScheduleEachWeek = async () => {
	console.log('createScheduleEachWeek');

	const prevWeekStart = moment()
		.subtract(1, 'week')
		.startOf('week')
		.add(1, 'day')
		.format('YYYY-MM-DD');
	const prevWeekEnd = moment()
		.subtract(1, 'week')
		.endOf('week')
		.format('YYYY-MM-DD');

	try {
		const prevWeekSchedule = await Schedule.findAll({
			//check the date in between the previous week
			where: {
				date: {
					[Op.between]: [prevWeekStart, prevWeekEnd],
				},
			},
			attributes: ['doctor_id', 'shift_id', 'date'],
		});

		prevWeekSchedule.forEach(async item => {
			//create new schedule for the next week
			try {
				await Schedule.create({
					doctor_id: item.doctor_id,
					date: moment(item.date).add(1, 'week').format('YYYY-MM-DD'),
					shift_id: item.shift_id,
				});
			} catch (error) {
				throw new Error(error.message);
			}
		});
	} catch (error) {
		throw new Error(error.message);
	}
};

const deleteSchedule = async (id, date) => {
	try {
		// check if date is in the past with YYYY-MM-DD format
		if (moment(date).isBefore(moment().format('YYYY-MM-DD'))) {
			throw new Error('Date is in the past');
		}

		// check if the schedule id is in appointments
		const appointment = await Appointment.findOne({
			where: {
				id: id,
			},
		});
		if (appointment) {
			throw new Error('Cannot delete schedule');
		}

		await Schedule.destroy({
			where: {
				id: id,
			},
		});
	} catch (error) {
		throw new Error(error.message || 'Cannot delete schedule');
	}
};

export default {
	getScheduleById,
	getScheduleOfDoctor,
	getScheduleOfDoctorByDate,
	createSchedule,
	createScheduleEachWeek,
	deleteSchedule,
};
