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
import { NotFoundError } from '../../errors';

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
		};

		if (status) {
			where = {
				...where,
				status: status,
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
					attributes: ['id', 'name'],
					required: false,
					subQuery: false,
				},
			],
			attributes: {
				exclude: ['customer_id', 'schedule_id', 'user_id', 'updatedAt'],
			},
			order: [['createdAt', 'DESC']],
		});
		console.log('rows', rows);
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
		const {status} = data;
		console.log('status', status);
		appointment.set({
			status: status,
		});
		await appointment.save();
		return appointment;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot update status appointment');
		} else {
			throw new Error(errors[0].message || 'Cannot update status appointment');
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
					attributes: ['name', 'birthday', 'gender', 'phone_number', 'email'],
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
									attributes: ['name'],
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
		const appointment = await Appointment.findByPk(id);
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

const getAllCustomers = async (q = '', currentPage = 1, limit) => {
	try {
		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;
		const { count, rows } = await Customer.findAndCountAll({
			offset: offset,
			limit: limit,
			where: {
				name: {
					[Op.iLike]: `%${q}%`,
				},
			},
			attributes: ['id', 'name', 'birthday', 'gender', 'phone_number', 'email'],
			include: [
				{
					model: Appointment,
					as: 'appointment',
					attributes: [
						[sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = 5 THEN 1 ELSE NULL END')), 'completed'],
						[sequelize.fn('COUNT', sequelize.literal('CASE WHEN status = 4 THEN 1 ELSE NULL END')), 'rejected']
					  ],
					required: false,
					subQuery: false,
				},
			],
			order: [['createdAt', 'DESC']],
		});
		console.log('rows', rows);
		if (count === 0) {
			return { rows: [], currentPage: 1, endPage: 1 };
		}

		const endPage = Math.ceil(count / limit);
		if (currentPage > endPage) throw new Error('Page is invalid');

		return { rows, currentPage, endPage };
	} catch (error) {
		throw new NotFoundError('Cannot get customers');
	}
};

const getCustomerById = async customerId => {
	try {
		const customer = await Customer.findByPk(customerId);

		if (!customer) throw new NotFoundError('Customer not found');

		return customer;
	} catch (error) {
		throw new NotFoundError('Cannot get customer');
	}
};

const updateCustomer = async (id, data) => {
	try {
		const customer = await Customer.findByPk(id);
		customer.set({
			...data,
		});
		await customer.save();
		return customer;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot update customer');
		} else {
			throw new Error(errors[0].message || 'Cannot update customer');
		}
	}
};

export default {
	getAllAppointments,
	updateStatusAppointment,
	getAppointmentById,
	updateAppointment,
	getAllCustomers,
	updateCustomer,
	getCustomerById,
};
