import { StatusCodes } from 'http-status-codes';
import User from '../../services/admin/UserServices';
import Doctor from '../../services/admin/DoctorServices';
import RolesEnum from '../../enums/RolesEnum';
import { configureMulter } from '../../utils';

const index = async (req, res) => {
	try {
		const { q, page, limit, role } = req.query;

		if (!role) {
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
				search: q,
				role: '',
				title: 'Quản lý người dùng',
			});
		} else {
			const { rows, currentPage, endPage } = await User.getAllUserByRole(
				role,
				q,
				page,
				limit
			);

			return res.render('./admin/users/index', {
				users: rows,
				pages: endPage,
				current: currentPage,
				limit: limit,
				search: q,
				title: 'Quản lý người dùng',
				role: role,
			});
		}
	} catch (error) {
		return res.redirect('/admin/users?page=1&limit=10');
	}
};

const create = async (req, res) => {
	try {
		const specialities = await Doctor.getAllSpeciality();

		return res.render('./admin/users/create', {
			title: 'Thêm người dùng',
			specialities: specialities,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot create user',
			data: [],
		});
	}
};

const store = async (req, res) => {
	const multerInstance = configureMulter('src/public/media/avatars');

	multerInstance.single('avatar')(req, res, async err => {
		if (err) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: err.message || 'Cannot create user',
				data: [],
			});
		}

		if (req.file) {
			req.body.avatar = req.file.path;
		} else {
			req.body.avatar = '';
		}

		try {
			const { role } = req.body;
			if (role == RolesEnum.DOCTOR) {
				const {
					speciality_id,
					rank,
					price,
					description,
					...user_data
				} = req.body;
				const user = await User.createUser(user_data);
				const doctor_data = {
					speciality_id: speciality_id,
					rank: rank,
					price: price,
					description: description,
					user_id: user.id,
				};

				await Doctor.createDoctor(doctor_data);
			} else {
				await User.createUser(req.body);
			}

			return res.redirect('/admin/users?page=1&limit=10&success=1');
		} catch (error) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: error.message || 'Cannot create user',
				data: [],
			});
		}
	});
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

const updateUserStatus = async (req, res) => {
	try {
		const user = await User.updateUserStatus(req.params.id);

		return res.status(StatusCodes.OK).json({
			message: 'Update user status successfully',
			data: user,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot update user status',
			data: [],
		});
	}
};

const getPercentageOfEachRole = async (req, res) => {
	try {
		const usersPercentage = User.getPercentageOfEachRole();
		usersPercentage.then(data => {
			return res.status(StatusCodes.OK).json({
				message: 'Get percentage of each role successfully',
				data: data,
			});
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get percentage of each role',
			data: [],
		});
	}
};

const resetPassword = async (req, res) => {
	try {
		const user = await User.resetPassword(req.params.id);

		return res.status(StatusCodes.OK).json({
			message: 'Reset password successfully',
			data: user,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot reset password',
			data: [],
		});
	}
};

export default {
	index,
	create,
	store,
	update,
	destroy,
	getPercentageOfEachRole,
	resetPassword,
	updateUserStatus,
};
