import { Router } from 'express';

const router = Router();

const clientRoutes = app => {
	router.get('/', (req, res) => {
		res.render('./client/index', {
			layout: './client_layouts/master',
		});
	});

	app.use('/', router);
};

export default clientRoutes;
