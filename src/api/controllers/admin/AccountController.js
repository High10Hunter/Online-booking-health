import { StatusCodes } from 'http-status-codes';
import User from '../../services/admin/UserServices';

const index = async (req, res) => {
	try {
		const { id } = req.payload;
		const user = await User.getUserById(id);

		return res.render('./admin/account', {
			title: 'Cài đặt tài khoản',
			id,
			user,
		});
	} catch (error) {
		return res.redirect('/admin');
	}
};

const update = async (req, res) => {
	try {
		const {new_password, confirm_password} = req.body;

		if (new_password !== confirm_password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Password does not match',
				data: [],
			});
		}

		const user = await User.updateUser(req.payload.id, req.body);

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

export default {
	index,
	update,
};
