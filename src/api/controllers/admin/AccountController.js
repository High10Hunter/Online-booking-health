import { StatusCodes } from 'http-status-codes';
import User from '../../services/admin/UserServices';
import { configureMulter } from '../../utils';

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
	const multerInstance = configureMulter('src/public/media/avatars');

	multerInstance.single('avatar')(req, res, async err => {
		if (err) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: err.message || 'Cannot update user account',
				data: [],
			});
		}

		if (req.file) {
			req.body.avatar = req.file.path;
		} else {
			req.body.avatar = '';
		}
		
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
	})

};

export default {
	index,
	update,
};
