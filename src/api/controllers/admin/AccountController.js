import { StatusCodes } from 'http-status-codes';
import AccountServices from '../../services/admin/AccountServices';

const index = async (req, res) => {
	try {
		// const { id } = req.user.id;
		// const user = await AccountServices.getUserById(req.user.id);
		

		return res.render('./admin/account', {
			// user : user,
			title: 'Cài đặt',
		});
	} catch (error) {
		return res.redirect('/admin');
	}
};



const update = async (req, res) => {
	try {
		const user = await AccountServices.updateUser(req.params.id, req.body);

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
