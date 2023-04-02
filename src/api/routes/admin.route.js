import { Router } from 'express';
import DoctorController from '../controllers/admin/DoctorController';
import ScheduleController from '../controllers/admin/ScheduleController';
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
	//* manage users routes
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

	router.get(
		'/users/create',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.create
	);

	// router.get('/users', UserController.index);

	router.put('/users/:id/update-status', UserController.updateUserStatus);
	router.put('/users/:id/reset-password', UserController.resetPassword);

	router.post(
		'/users/create',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.store
	);

	router.patch('/users/update/:id', UserController.update);
	router.delete('/users/destroy/:id', UserController.destroy);

	router.post(
		'/users/userPercentage',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.getPercentageOfEachRole
	);

	//* manage doctor's schedule routes
	router.get(
		'/schedules',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		DoctorController.index
	);

	router.get(
		'/schedule/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.index
	);

	router.get(
		'/api/getScheduleOfDoctor/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.getScheduleOfDoctor
	);

	router.post(
		'/api/schedule/create',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.create
	);

	router.delete(
		'/api/schedule/delete/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.destroy
	);

	router.delete(
		'/api/schedule/delete/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.destroy
	);

	//* manage doctors routes
	router.get(
		'/doctors/update',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		DoctorController.getDoctor
	);

	router.post('/doctors/update', DoctorController.update);
	app.use('/admin', router);
};

export default adminRoutes;
