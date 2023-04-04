import { Router } from 'express';

const router = Router();

const clientRoutes = app => {
	router.get('/', (req, res) => {
		res.render('./client/index', {
			layout: './layouts/client_layouts/master',
		});
	});

	router.get('/booking', (req, res) => {
		res.render('./client/booking', {
			layout: './layouts/client_layouts/master',
		});
	});

	router.get('/doctor-list', (req, res) => {
		res.render('./client/doctor_list', {
			layout: './layouts/client_layouts/master',
		});
	});

	router.get('/doctor-profile', (req, res) => {
		res.render('./client/doctor_profile', {
			layout: './layouts/client_layouts/master',
		});
	});

	app.use('/', router);
};

export default clientRoutes;
