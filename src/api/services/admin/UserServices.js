import { User } from '../../models';
import { Op } from 'sequelize';
import { NotFoundError } from '../../errors';
import { hashPassword, validPassword } from '../../utils';
import NodeCache from 'node-cache';

const myCache = new NodeCache();

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

const getUserById = async id => {
	try {
		const user = await User.findByPk(id, {
			attributes: {
				exclude: ['password'],
			},
		});

		if (!user) throw new NotFoundError('User not found');

		return user;
	} catch (error) {
		throw new NotFoundError('Cannot get user');
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

const getPercentageOfEachRole = async (req, res) => {
	try {
		let usersPercentage = await myCache.get('usersPercentage');

		if (usersPercentage == undefined) {
			const users = await User.findAll();

			let adminCount = 0;
			let nurseCount = 0;
			let doctorCount = 0;

			users.forEach(user => {
				if (user.role === 1) adminCount++;
				else if (user.role === 2) nurseCount++;
				else if (user.role === 3) doctorCount++;
			});

			const totalCount = adminCount + nurseCount + doctorCount;
			const adminPercentage =
				Math.round((adminCount / totalCount) * 100 * 100) / 100;
			const nursePercentage =
				Math.round((nurseCount / totalCount) * 100 * 100) / 100;
			const doctorPercentage =
				Math.round((doctorCount / totalCount) * 100 * 100) / 100;

			usersPercentage = {
				adminPercentage,
				nursePercentage,
				doctorPercentage,
			};

			myCache.set('usersPercentage', usersPercentage, 86400);
		}

		return usersPercentage;
	} catch (error) {
		throw new NotFoundError('Cannot calculate percentage of each role');
	}
};

const createUser = async data => {
	try {
		const { birthday, gender, email, avatar } = data;
		let genderInput = 1;
		if (gender === 'female') genderInput = 0;

		//ex: birthday: 1999-03-01 => password: 01031999
		let dateArr = birthday.split('-');
		dateArr.reverse();
		dateArr = dateArr.join('');

		const hashedPassword = await hashPassword(dateArr);

		// given avatar = src/public/media/avatar-1619780000000.jpg
		// => avatar = /media/avatar-1619780000000.jpg
		const avatarInput = avatar.split('public')[1];

		const user = await User.create({
			...data,
			password: hashedPassword,
			username: email,
			gender: genderInput,
			avatar: avatarInput,
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

		const {old_password, new_password} = data;

		if (old_password) {
			const isPasswordValid = await validPassword(old_password, user.password);
			
			if (!isPasswordValid) {
				throw new Error('Old password is invalid');
			}
		}

		if (new_password) {
			const hashedPassword = await hashPassword(new_password);
			data.password = hashedPassword;
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

const updateUserStatus = async id => {
	try {
		const user = await User.findByPk(id);

		let { status } = user;
		status = !status;

		user.set({
			status,
		});

		await user.save();

		return user;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot update user status');
		} else {
			throw new Error(errors[0].message || 'Cannot update user status');
		}
	}
};

const resetPassword = async id => {
	try {
		const user = await User.findByPk(id);

		const { birthday } = user;

		let dateArr = birthday.split('-');
		dateArr.reverse();
		dateArr = dateArr.join('');

		const hashedPassword = await hashPassword(dateArr);

		user.set({
			password: hashedPassword,
		});

		await user.save();
		return user;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot reset password');
		} else {
			throw new Error(errors[0].message || 'Cannot reset password');
		}
	}
};

export default {
	getAllUser,
	getUserById,
	getAllUserByRole,
	createUser,
	updateUser,
	deleteUser,
	updateUserStatus,
	resetPassword,
	getPercentageOfEachRole,
};
