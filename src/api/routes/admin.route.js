import { Router } from 'express';
import UserController from '../controllers/admin/UserController';
import RolesEnum from '../enums/RolesEnum';
import verifyRoles from '../middlewares/verifyRoles';
import { verifyAccessToken } from '../services/jwt/JwtServices';

const router = Router();

// const adminRoutes = app => {
// 	//manage users routes
// 	router.get('/users', UserController.index);
// 	router.post('/users/create', UserController.create);
// 	router.patch('/users/update/:id', UserController.update);
// 	router.delete('/users/destroy/:id', UserController.destroy);

// 	app.use('/api/admin', router);
// };

const adminRoutes = app => {
	//manage users routes
	router.get(
		'/',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		(req, res) => {
			res.render('admin/index', {
				title: 'Admin',
			});
		}
	);

	router.get(
		'/users',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.index
	);

	router.post(
		'/users/resetPassword',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.resetPassword
	);

	router.post(
		'/userPercentage',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.getPercentageOfEachRole
	);

	//CRUD users
	// router.get('/users', UserController.index);
	router.post('/users/create', UserController.create);
	router.patch('/users/update/:id', UserController.update);
	router.delete('/users/destroy/:id', UserController.destroy);

	app.use('/admin', router);
};

export default adminRoutes;
