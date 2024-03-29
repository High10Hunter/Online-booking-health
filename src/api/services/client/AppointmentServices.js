import { Op } from 'sequelize';
import AppointmentStatusEnum from '../../enums/AppoimentStatusEnum';
import {
	Appointment,
	Schedule,
	Shift,
	User,
	Doctor,
	Speciality,
	sequelize,
} from '../../models';
import moment from 'moment';

const getAppointmentsByScheduleId = async schedule_id => {
	try {
		const schedule = await Schedule.findOne({
			where: {
				id: schedule_id,
			},
			attributes: ['id', 'date'],
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
					attributes: ['rank', 'price'],
					required: false,
					subQuery: false,
					include: [
						{
							model: User,
							as: 'user',
							attributes: ['name', 'avatar'],
							required: false,
							subQuery: false,
						},
						{
							model: Speciality,
							as: 'speciality',
							attributes: ['name'],
							required: false,
							subQuery: false,
						},
					],
				},
			],
		});
		return schedule;
	} catch (error) {
		throw new Error(error.message || 'Cannot get schedule');
	}
};

const getFreeSchedulesById = async id => {
	try {
		const schedule = await Schedule.findOne({
			where: {
				id: id,
				[Op.not]: [
					sequelize.literal(
						'exists (select * from "appointments" where "appointments"."schedule_id" = "Schedule"."id")'
					),
				],
			},
			attributes: ['id', 'date'],
			include: [
				{
					model: Appointment,
					as: 'appointments',
					required: false,
					subQuery: false,
					attributes: ['schedule_id'],
				},
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
					attributes: ['rank', 'price'],
					required: false,
					subQuery: false,
					include: [
						{
							model: User,
							as: 'user',
							attributes: ['name', 'avatar'],
							required: false,
							subQuery: false,
						},
						{
							model: Speciality,
							as: 'speciality',
							attributes: ['name'],
							required: false,
							subQuery: false,
						},
					],
				},
			],
		});

		if (!schedule) {
			throw new Error('Cannot get schedule');
		}

		const currentDate = moment().format('YYYY-MM-DD');
		const scheduleDate = moment(schedule.date).format('YYYY-MM-DD');
		if (currentDate === scheduleDate) {
			const currentTime = moment().add(1, 'hour').format('HH:mm:ss');
			if (currentTime >= schedule.shift.start_time) {
				throw new Error('Cannot get schedule');
			}
		}

		return schedule;
	} catch (error) {
		throw new Error(error.message || 'Cannot get schedule');
	}
};

const createAppointment = async data => {
	try {
		const { schedule_id, customer_id } = data;

		const scheduleInfo = await Schedule.findByPk(schedule_id, {
			attributes: ['id', 'date'],
			include: [
				{
					model: Shift,
					as: 'shift',
					attributes: ['start_time', 'end_time'],
					subQuery: false,
				},
			],
		});

		if (!scheduleInfo) {
			throw new Error('Schedule not found');
		}

		const currentDate = moment().format('YYYY-MM-DD');
		const scheduleDate = moment(scheduleInfo.date).format('YYYY-MM-DD');
		if (currentDate === scheduleDate) {
			const currentTime = moment().add(1, 'hour').format('HH:mm:ss');
			if (currentTime >= scheduleInfo.shift.start_time) {
				throw new Error('Cannot create appointment');
			}
		}

		const bookedSchedule = await Appointment.findOne({
			where: {
				schedule_id: schedule_id,
				customer_id: customer_id,
			},
		});

		if (bookedSchedule) {
			throw new Error('You have already booked this schedule');
		}

		const appointment = await Appointment.create(data);
		return appointment;
	} catch (error) {
		throw new Error(error.message || 'Cannot create appointment');
	}
};

const confirmAppointment = async (id, customer_id) => {
	try {
		const appointment = await Appointment.findOne({
			where: {
				id: id,
				customer_id: customer_id,
				status: AppointmentStatusEnum.NOT_CONFIRMED,
			},
			attributes: ['id'],
		});

		if (!appointment) {
			throw new Error('Appointment not found');
		}

		appointment.status = AppointmentStatusEnum.PENDING;
		await appointment.save();
	} catch (error) {
		throw new Error(error.message || 'Cannot get appointment');
	}
};

const cancelAppointment = async (id, customer_id) => {
	try {
		const appointment = await Appointment.findOne({
			where: {
				id: id,
				customer_id: customer_id,
				[Op.or]: [
					{
						status: AppointmentStatusEnum.PENDING,
					},
					{
						status: AppointmentStatusEnum.APPROVED,
					},
				],
			},
			attributes: ['id'],
		});

		if (!appointment) {
			throw new Error('Appointment not found');
		}

		await appointment.destroy();
	} catch (error) {
		throw new Error(error.message || 'Cannot get appointment');
	}
};

const deleteUnconfirmedAppointment = async () => {
	try {
		const periodToDelete = new Date(new Date() - 10 * 60 * 1000);

		// Find all records where the status still NOT_CONFIMRED in the last 10 minutes
		const recordsToDelete = await Appointment.findAll({
			where: {
				status: AppointmentStatusEnum.NOT_CONFIRMED,
				updatedAt: {
					[Op.lt]: periodToDelete,
				},
			},
		});

		if (!recordsToDelete) {
			return;
		}

		// Delete found records
		await Promise.all(recordsToDelete.map(record => record.destroy()));
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot delete appointment',
		});
	}
};

export default {
	getAppointmentsByScheduleId,
	getFreeSchedulesById,
	createAppointment,
	confirmAppointment,
	cancelAppointment,
	deleteUnconfirmedAppointment,
};
