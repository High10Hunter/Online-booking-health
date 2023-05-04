import { Router } from 'express';
import RolesEnum from '../enums/RolesEnum';
import verifyRoles from '../middlewares/verifyRoles';
import { verifyAccessToken } from '../services/jwt/JwtServices';
import ScheduleController from '../controllers/doctor/ScheduleController';

const router = Router();

const doctorRoutes = app => {
	router.get(
		'/',
		verifyAccessToken,
		verifyRoles(RolesEnum.DOCTOR),
		ScheduleController.index
	);

	router.get(
		'/api/schedules',
		verifyAccessToken,
		verifyRoles(RolesEnum.DOCTOR),
		ScheduleController.getSchedulesOfDoctor
	);

	app.use('/doctor', router);
};

export default doctorRoutes;
