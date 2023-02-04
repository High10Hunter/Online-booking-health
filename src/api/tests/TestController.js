import UserServices from '../services/admin/UserServices';
import JwtServices from '../services/jwt/JwtServices';
import { User } from '../models';
import { Sequelize } from 'sequelize';
import RolesEnum from '../enums/RolesEnum';

const testFunc = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				id: 21,
			},
		});

		console.log(user.getRole());
	} catch (error) {
		console.log(error);
	}

	res.send('test completed');
};

export default { testFunc };
