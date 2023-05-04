import {
	Appointment,
	Customer,
	Doctor,
	Schedule,
	Shift,
	Speciality,
	User,
} from '../../models';
import { sequelize } from '../../models';
import { NotFoundError } from '../../errors';


const getAllCustomers = async (q = '', currentPage = 1, status = '') => {
	try {
		const limit = 10;
		if (currentPage <= 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;
		let query = '';
		let count = 0;
		if(status !== 'bad'){
			query = `
				SELECT
					customers.id, 
					customers.name, 
					customers.birthday, 
					customers.gender, 
					customers.phone_number, 
					customers.email, 
					COUNT(appointments.id) AS booked, 
					COUNT(CASE WHEN appointments.status = 5 THEN 1 END) AS completed,
					COUNT(CASE WHEN appointments.status = 4 THEN 1 END) AS declined
				FROM customers
				LEFT JOIN appointments ON customers.id = appointments.customer_id
				WHERE customers.name ILIKE :name
				GROUP BY customers.id
				ORDER BY customers.id ASC
				OFFSET :offset
				LIMIT :limit
			`;
			count = await Customer.count();
		}
		else
		{
			query = `
				SELECT
					customers.id, 
					customers.name, 
					customers.birthday, 
					customers.gender, 
					customers.phone_number, 
					customers.email, 
					COUNT(appointments.id) AS booked, 
					COUNT(CASE WHEN appointments.status = 5 THEN 1 END) AS completed,
					COUNT(CASE WHEN appointments.status = 4 THEN 1 END) AS declined,
					COUNT(CASE WHEN appointments.status = 4 AND schedules.date <= NOW() AND schedules.date >= NOW() - INTERVAL '30 days' THEN 1 END) AS declined_last_month
				FROM customers
				LEFT JOIN appointments ON customers.id = appointments.customer_id
				LEFT JOIN schedules ON appointments.schedule_id = schedules.id
				WHERE customers.name ILIKE :name
				GROUP BY customers.id
				HAVING COUNT(CASE WHEN appointments.status = 4 AND schedules.date <= NOW() AND schedules.date >= NOW() - INTERVAL '30 days' THEN 1 END) >= 3
				ORDER BY customers.id ASC
				OFFSET :offset
				LIMIT :limit
			`;

			const queryToCount = `
				SELECT COUNT(*) AS count FROM (
					SELECT
						customers.id,
						customers.name
					FROM customers
					LEFT JOIN appointments ON customers.id = appointments.customer_id
					LEFT JOIN schedules ON appointments.schedule_id = schedules.id
					WHERE customers.name ILIKE :name
					GROUP BY customers.id
					HAVING COUNT(CASE WHEN appointments.status = 4 AND schedules.date <= NOW() AND schedules.date >= NOW() - INTERVAL '30 days' THEN 1 END) >= 3
					ORDER BY customers.id ASC
				) AS countBadStatus
			`;
			const badRows = await sequelize.query(
				queryToCount, 
				{
					replacements: {
						name: `%${q}%`,
					},
					type: sequelize.QueryTypes.SELECT,
				}
			);
			count = parseInt(badRows[0].count);
		}
		const rows = await sequelize.query(
			query, 
			{
				replacements: {
					name: `%${q}%`,
					offset,
					limit,
				},
				type: sequelize.QueryTypes.SELECT,
			}
		);

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

const getAppointmentOfCustomer = async customerId => {
	try {
		const rows = await Appointment.findAll({
			where: {
				customer_id: customerId,
			},
			attributes: ['id', 'status', 'createdAt'],
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
			],
			order: [['createdAt', 'DESC']],
		});
		return rows;
	} catch (error) {
		throw new NotFoundError('Cannot get customers');
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
	getAllCustomers,
	getCustomerById,
	getAppointmentOfCustomer,
	updateCustomer,
};
