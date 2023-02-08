import { User } from '../../models';
import { Op } from 'sequelize';
import { NotFoundError } from '../../errors';
import { hashPassword } from '../../utils';
import createError from 'http-errors';

const getAllUser = async (q = '', currentPage = 1, limit = 10) => {
	try {
		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;
		const { count, rows } = await User.findAndCountAll({
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
		throw new NotFoundError('Cannot get users');
	}
};

const getAllUserByRole = async (role, q = '', currentPage = 1, limit = 10) => {
	try {
		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;
		const { count, rows } = await User.findAndCountAll({
			offset: offset,
			limit: limit,
			where: {
				name: {
					[Op.iLike]: `%${q}%`,
				},
				status: true,
				role: role,
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
		throw new NotFoundError('Cannot get users');
	}
};

const createUser = async data => {
	try {
		const { birthday } = data;

		//ex: birthday: 1999-03-01 => password: 01031999
		let dateArr = birthday.split('-');
		dateArr.reverse();
		dateArr = dateArr.join('');

		const hashedPassword = await hashPassword(dateArr);

		const user = await User.create({
			...data,
			password: hashedPassword,
			status: 1,
		});

		return user;
	} catch (error) {
		const { errors } = error;
		throw new Error(errors[0].message);
	}
};

const updateUser = async (id, data) => {
	try {
		const user = await User.findByPk(id);

		const { password } = data;

		if (password) {
			console.log(1);
			throw new Error('Cannot update password');
		}

		user.set({
			...data,
		});

		await user.save();

		return user;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot update user');
		} else {
			throw new Error(errors[0].message || 'Cannot update user');
		}
	}
};

const deleteUser = async id => {
	try {
		const user = await User.findByPk(id);
		if (!user) {
			throw new Error('User not found');
		}

		await user.destroy();
	} catch (error) {
		throw new Error(error.message || 'Cannot delete user');
	}
};

export default {
	getAllUser,
	getAllUserByRole,
	createUser,
	updateUser,
	deleteUser,
};
