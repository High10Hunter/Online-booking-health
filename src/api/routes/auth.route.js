import { Router } from 'express';
import AuthController from '../controllers/AuthController';

import checkIfLoggedIn from '../middlewares/checkIfLoggedIn';

const router = Router();

const authRoutes = app => {
	//authentication routes
	router.get('/login', checkIfLoggedIn, AuthController.index);
	router.post('/login', AuthController.login);
	router.post('/logout', AuthController.logout);

	app.use('/auth', router);
};

export default authRoutes;
