import { Op } from 'sequelize';
import {
	Appointment,
	Customer,
	Doctor,
	Schedule,
	Shift,
	Speciality,
	User,
} from '../../models';
import { NotFoundError, BadRequestError } from '../../errors';
import AppointmentStatusEnum from '../../enums/AppoimentStatusEnum';
import moment from 'moment';

const getAllAppointments = async (q = '', currentPage = 1, status) => {
	try {
		const limit = 10;
		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;
		let where = {
			'$customer.name$': {
				[Op.iLike]: `%${q}%`,
			},
			status: {
				[Op.ne]: AppointmentStatusEnum.NOT_CONFIRMED,
			},
		};

		if (status) {
			where = {
				...where,
				status: {
					[Op.eq]: status,
				},
			};
		}
		const { count, rows } = await Appointment.findAndCountAll({
			offset: offset,
			limit: limit,
			where: {
				...where,
			},
			include: [
				{
					model: Customer,
					as: 'customer',
					attributes: ['id', 'name', 'phone_number', 'email'],
					required: false,
					subQuery: false,
				},
				{
					model: Schedule,
					as: 'schedule',
					attributes: ['id', 'date'],
					required: false,
					subQuery: false,
					include: [
						{
							model: Shift,
							as: 'shift',
							attributes: ['id', 'start_time', 'end_time'],
							required: false,
							subQuery: false,
						},
						{
							model: Doctor,
							as: 'doctor',
							attributes: ['id', 'price', 'rank'],
							required: false,
							subQuery: false,
							include: [
								{
									model: User,
									as: 'user',
									attributes: ['id', 'name'],
									required: false,
									subQuery: false,
								},
							],
						},
					],
				},
				{
					model: User,
					as: 'user',
					attributes: ['id', 'name', 'avatar'],
					required: false,
					subQuery: false,
				},
			],
			attributes: {
				exclude: ['customer_id', 'schedule_id', 'user_id', 'updatedAt'],
			},
			order: [['createdAt', 'DESC']],
		});

		if (count === 0) {
			return { rows: [], currentPage: 1, endPage: 1 };
		}

		const endPage = Math.ceil(count / limit);
		if (currentPage > endPage) throw new Error('Page is invalid');

		return { rows, currentPage, endPage };
	} catch (error) {
		throw new NotFoundError('Cannot get appointments');
	}
};

const updateStatusAppointment = async (id, data) => {
	try {
		const appointment = await Appointment.findByPk(id);
		const { status } = data;
		appointment.set({
			status: status,
		});
		await appointment.save();
		return appointment;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(
				error.message || 'Cannot update status appointment'
			);
		} else {
			throw new Error(
				errors[0].message || 'Cannot update status appointment'
			);
		}
	}
};

const getAppointmentById = async appointmentId => {
	try {
		const appointment = await Appointment.findOne({
			where: {
				id: appointmentId,
			},
			include: [
				{
					model: Customer,
					as: 'customer',
					attributes: [
						'name',
						'birthday',
						'gender',
						'phone_number',
						'email',
					],
					required: false,
					subQuery: false,
				},
				{
					model: Schedule,
					as: 'schedule',
					attributes: ['date'],
					required: false,
					subQuery: false,
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
							attributes: ['price', 'rank'],
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
				},
				{
					model: User,
					as: 'user',
					attributes: ['name'],
					required: false,
					subQuery: false,
				},
			],
		});
		return appointment;
	} catch (error) {
		throw new NotFoundError('Cannot get appointment');
	}
};

const updateAppointment = async (id, data, userId) => {
	try {
		const appointment = await Appointment.findOne({
			where: {
				id,
			},
			include: [
				{
					model: Schedule,
					as: 'schedule',
					attributes: ['date'],
					required: false,
					subQuery: false,
					include: [
						{
							model: Shift,
							as: 'shift',
							attributes: ['start_time', 'end_time'],
							required: false,
							subQuery: false,
						},
					],
				},
			],
		});

		if (!appointment) throw new Error('Appointment not found');

		const expired = moment(
			appointment.schedule.date +
				' ' +
				appointment.schedule.shift.end_time
		).isBefore(moment().format('YYYY-MM-DD HH:mm:ss'));

		if (expired) throw new Error('Appointment is expired');

		appointment.set({
			...data,
			user_id: userId,
		});
		await appointment.save();

		const customer = await Customer.findByPk(appointment.customer_id);
		customer.set({
			...data.customer,
		});
		await customer.save();
		return appointment;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot update appointment');
		} else {
			throw new Error(errors[0].message || 'Cannot update appointment');
		}
	}
};

const countAppointmentByDate = async (startDate, endDate) => {
	try {
		const count = await Appointment.count({
			where: {
				'$schedule.date$': {
					[Op.between]: [startDate, endDate],
				},
				status: AppointmentStatusEnum.APPROVED,
			},
			include: [
				{
					model: Schedule,
					as: 'schedule',
					attributes: ['id'],
					required: true,
					subQuery: false,
				},
			],
		});

		return count;
	} catch (error) {
		throw new BadRequestError('Cannot get count appointment');
	}
};

const countAppointmentByDateAndStatus = async (startDate, endDate, status) => {
	try {
		const count = await Appointment.count({
			where: {
				'$schedule.date$': {
					[Op.between]: [startDate, endDate],
				},
				status: status,
			},
			include: [
				{
					model: Schedule,
					as: 'schedule',
					attributes: ['id'],
					required: true,
					subQuery: false,
				},
			],
		});

		return count;
	} catch (error) {
		throw new BadRequestError('Cannot get count appointment');
	}
};

const countPendingAppointment = async () => {
	try {
		const count = await Appointment.count({
			where: {
				status: AppointmentStatusEnum.PENDING,
			},
		});

		return count;
	} catch (error) {
		throw new BadRequestError('Cannot get count pending appointment');
	}
};

export default {
	getAllAppointments,
	updateStatusAppointment,
	getAppointmentById,
	updateAppointment,
	countAppointmentByDate,
	countAppointmentByDateAndStatus,
	countPendingAppointment,
};
