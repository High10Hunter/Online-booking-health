import { Router } from 'express';
import RolesEnum from '../enums/RolesEnum';
import verifyRoles from '../middlewares/verifyRoles';
import { verifyAccessToken } from '../services/jwt/JwtServices';

const router = Router();

const nurseRoutes = app => {
	router.get(
		'/',
		verifyAccessToken,
		verifyRoles(RolesEnum.NURSE),
		(req, res) => {
			res.render('nurse/index', {
				title: 'Nurse',
			});
		}
	);

	app.use('/nurse', router);
};

export default nurseRoutes;
