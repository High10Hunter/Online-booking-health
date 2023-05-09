import UserServices from '../services/admin/UserServices';
import JwtServices from '../services/jwt/JwtServices';
import { User } from '../models';
import { Sequelize } from 'sequelize';
import RolesEnum from '../enums/RolesEnum';
import AppointmentServices from '../services/nurses/AppointmentServices';
import DoctorServices from '../services/client/DoctorServices';

const testFunc = async (req, res) => {
	try {
		const data = await DoctorServices.getDoctorsForHomePage();
		return res.json(data);
	} catch (error) {
		console.log(error);
	}

	res.send('test completed');
};

export default { testFunc };
