import { Router } from 'express';
import RolesEnum from '../enums/RolesEnum';
import verifyRoles from '../middlewares/verifyRoles';
import { verifyAccessToken } from '../services/jwt/JwtServices';

const router = Router();

const doctorRoutes = app => {
	router.get(
		'/',
		verifyAccessToken,
		verifyRoles(RolesEnum.DOCTOR),
		(req, res) => {
			res.render('doctor/index', {
				title: 'Doctor',
			});
		}
	);

	app.use('/doctor', router);
};

export default doctorRoutes;
