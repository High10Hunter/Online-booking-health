import express from 'express';
import web from './api/routes';
import viewEngine from './api/config/viewEngine';

import notFoundMiddleware from './api/middlewares/not-found';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
viewEngine(app);

web.authRoutes(app);
web.adminRoutes(app);

app.use(notFoundMiddleware);

export default app;
