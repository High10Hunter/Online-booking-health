import { Router } from 'express';
import RolesEnum from '../enums/RolesEnum';
import verifyRoles from '../middlewares/verifyRoles';
import { verifyAccessToken } from '../services/jwt/JwtServices';

import AppointmentController from '../controllers/nurse/AppointmentController';

const router = Router();

const nurseRoutes = app => {
	router.get(
		'/',
		verifyAccessToken,
		verifyRoles(RolesEnum.NURSE),
		AppointmentController.homepage
	);
	router.get(
		'/appointments',
		verifyAccessToken,
		verifyRoles(RolesEnum.NURSE),
		AppointmentController.index
	);

	router.post(
		'/appointments/:id/update-status-appointment',
		verifyAccessToken,
		verifyRoles(RolesEnum.NURSE),
		AppointmentController.updateStatus
	);

	router.get(
		'/appointments/:id',
		verifyAccessToken,
		verifyRoles(RolesEnum.NURSE),
		AppointmentController.getAppointment
	);

	router.post(
		'/appointments/:id/update-appointment',
		verifyAccessToken,
		verifyRoles(RolesEnum.NURSE),
		AppointmentController.update
	);
	app.use('/nurse', router);
};

export default nurseRoutes;
