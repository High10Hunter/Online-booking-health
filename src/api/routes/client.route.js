import { Router } from 'express';
import DoctorController from '../controllers/client/DoctorController';
import AppointmentController from '../controllers/client/AppointmentController';

const router = Router();

const clientRoutes = app => {
	router.get('/', DoctorController.homepage);
	router.get('/doctors', DoctorController.index);
	router.get('/doctor_profile', DoctorController.show);
	router.get('/booking/:schedule_id', AppointmentController.index);
	router.post('/api/booking', AppointmentController.store);
	router.get('/confirm-appointment/:token', AppointmentController.confirm);
	router.get('/cancel-appointment/:token', AppointmentController.cancel);

	app.use('/', router);
};

export default clientRoutes;
