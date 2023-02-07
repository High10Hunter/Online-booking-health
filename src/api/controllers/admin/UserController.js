import { StatusCodes } from 'http-status-codes';
import User from '../../services/admin/UserServices';

const index = async (req, res) => {
	try {
		const { q, page, limit } = req.query;

		const { rows, currentPage, endPage } = await User.getAllUser(
			q,
			page,
			limit
		);

		return res.render('./admin/users/index', {
			users: rows,
			pages: endPage,
			current: currentPage,
			limit: limit,
			title: 'Manage Users',
		});
	} catch (error) {
		return res.redirect('/admin/users?page=1&limit=10');
	}
};

const create = async (req, res) => {
	try {
		const user = await User.createUser(req.body);

		return res.status(StatusCodes.CREATED).json({
			message: 'Create user successfully',
			data: user,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot create user',
			data: [],
		});
	}
};

const update = async (req, res) => {
	try {
		const user = await User.updateUser(req.params.id, req.body);

		return res.status(StatusCodes.OK).json({
			message: 'Update user successfully',
			data: user,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot update user',
			data: [],
		});
	}
};

const destroy = async (req, res) => {
	try {
		await User.deleteUser(req.params.id);

		return res.status(StatusCodes.OK).json({
			message: 'Delete user successfully',
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot delete user',
		});
	}
};

export default { index, create, update, destroy };
