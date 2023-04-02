import { User } from '../../models';
import { Op } from 'sequelize';
import { NotFoundError } from '../../errors';
import { hashPassword } from '../../utils';
import NodeCache from 'node-cache';
import createError from 'http-errors';

const myCache = new NodeCache();

const getUserById = async id => {
	try {
		const user = await User.findByPk(id);

		if (!user) throw new Error('User not found');

		return user;
	} catch (error) {
		throw new NotFoundError('Cannot get user');
	}
};



const updateUser = async (id, data) => {
	try {
		const user = await User.findByPk(id);

		if (password) {
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

export default {
	getUserById,
	updateUser,
};
