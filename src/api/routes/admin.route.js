import { Router } from 'express';
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

	router.get(/users\/create/, (req, res) => {
		res.render('admin/users/create', {
			title: 'Create User',
		});
	});

	router.get(/users\/update/, (req, res) => {
		res.render('admin/users/update', {
			title: 'Update User Info',
		});
	});

	// router.get(
	// 	'/users/create', 
	// 	verifyAccessToken,
	// 	verifyRoles(RolesEnum.ADMIN),
	// 	// UserController.create
	// );
	
	// router.get('/users\/update',
	// 	verifyAccessToken,
	// 	verifyRoles(RolesEnum.ADMIN),
	// 	// UserController.update
	// );

	//CRUD users
	// router.get('/users', UserController.index);
	router.post('/users/create', UserController.create);
	router.patch('/users/update/:id', UserController.update);
	router.delete('/users/destroy/:id', UserController.destroy);
	router.post(
		'/users/resetPassword',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		UserController.resetPassword
	);

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

	//* manage doctors routes
	router.get(
		'/doctors/update',
		verifyAccessToken,
		verifyRoles(RolesEnum.ADMIN),
		DoctorController.getDoctor
	);

	router.post('/doctors/update', DoctorController.update);

	//* account settings
	router.get(
		'/account',
		verifyAccessToken,
		AccountController.index
	);

	router.post('/account', AccountController.update);

	app.use('/admin', router);
};

export default adminRoutes;
