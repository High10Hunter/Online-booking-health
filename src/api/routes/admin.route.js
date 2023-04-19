import { Router } from 'express';
import DoctorController from '../controllers/admin/DoctorController';
import ScheduleController from '../controllers/admin/ScheduleController';
import UserController from '../controllers/admin/UserController';
import AccountController from '../controllers/admin/AccountController';
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

	router.post(
		'/users/:id/update-status',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.updateUserStatus
	);

	router.post(
		'/users/:id/reset-password',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.resetPassword
	);

	router.post(
		'/users/create',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.store
	);

	router.patch(
		'/users/update/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.update
	);

	router.delete(
		'/users/destroy/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.destroy
	);

	router.post(
		'/users/users-percentage',
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
		'/doctors/:id/schedules',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.index
	);

	router.get(
		'/api/doctors/:id/schedules',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.getScheduleOfDoctor
	);

	router.post(
		'/api/schedules/create',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.create
	);

	router.delete(
		'/api/schedules/delete/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		ScheduleController.destroy
	);

	//* manage doctors routes
	router.get(
		'/doctors/:id/update',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		DoctorController.getDoctor
	);

	router.post(
		'/doctors/:id/update',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		DoctorController.update
	);

	app.use('/admin', router);
};

export default adminRoutes;
