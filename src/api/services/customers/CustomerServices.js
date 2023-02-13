import { Customer } from '../../models';
import { Op } from 'sequelize';
import { NotFoundError } from '../../errors';

const getAllCustomer = async (q = '', currentPage = 1, limit = 10) => {
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
				status: true,
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
		throw new NotFoundError('Cannot get customers');
	}
};

const createCustomer = async data => {
	try {
		const customer = await Customer.create(data);

		return customer;
	} catch (error) {
		const { errors } = error;
		throw new Error(errors[0].message);
	}
};

const updateCustomer = async (id, data) => {
	try {
		const customer = await Customer.findByPk(id);
		customer.set(data);
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
	getAllCustomer,
	createCustomer,
	updateCustomer,
};
