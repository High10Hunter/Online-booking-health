import { Router } from 'express';
import { verifyAccessToken } from '../services/jwt/JwtServices';
import AccountController from '../controllers/AccountController';

const router = Router();

const accountRoutes = app => {
	router.get('/account', verifyAccessToken, AccountController.index);
	router.post('/account', verifyAccessToken, AccountController.update);

	app.use('/', router);
};

export default accountRoutes;
