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

	router.get('/users/create', (req, res) => {
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

	app.use('/admin', router);
};

export default adminRoutes;
