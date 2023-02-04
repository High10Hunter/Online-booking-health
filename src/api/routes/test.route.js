import { Router } from 'express';
import TestController from '../tests/TestController';
import { verifyAccessToken } from '../services/jwt/JwtServices';
import verifyRoles from '../middlewares/verifyRoles';
import RolesEnum from '../enums/RolesEnum';

const router = Router();

const testRoute = app => {
	router.get('/test', TestController.testFunc);
	router.get('/authed', verifyAccessToken, (req, res) => {
		res.render('./tests/authed', {
			layout: './tests/authed',
		});
	});

	router.get(
		'/test/admin',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		(req, res) => {
			res.send('Admin page');
		}
	);

	app.use('/', router);
};

export default testRoute;
