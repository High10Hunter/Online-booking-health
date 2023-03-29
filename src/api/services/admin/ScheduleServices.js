import { Schedule, Shift } from '../../models';
import { Op } from 'sequelize';
import moment from 'moment';

const getScheduleOfDoctor = async doctorId => {
	try {
		const data = await Schedule.findAll({
			where: {
				doctor_id: doctorId,
				//having the date is within the current week and the next week
				//ex: current week: 2023-01-01 -> 2023-01-07
				//next week: 2023-01-08 -> 2023-01-14

				date: {
					[Op.between]: [
						moment().startOf('week').format('YYYY-MM-DD'),
						moment()
							.add(1, 'week')
							.endOf('week')
							.format('YYYY-MM-DD'),
					],
				},
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
			attributes: ['date'],
		});

		let schedules = [];
		data.forEach(item => {
			//ex: date: 2023-01-01, start_time: 08:00:00
			// => 2023-01-01T08:00:00
			schedules.push({
				start_time: item.date + 'T' + item.shift.start_time,
				end_time: item.date + 'T' + item.shift.end_time,
			});
		});

		return schedules;
	} catch (error) {
		throw new Error("Can't get schedules");
	}
};

const createSchedule = async (doctorId, date, start_time) => {
	try {
		//check if start time is in the past with HH:mm format
		if (moment(start_time, 'HH:mm').isBefore(moment())) {
			throw new Error('Start time is in the past');
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

export default {
	getScheduleOfDoctor,
	createSchedule,
	createScheduleEachWeek,
};
