import express from 'express';
import cookieParser from 'cookie-parser';

import web from './api/routes';
import viewEngine from './api/config/viewEngine';

import notFoundMiddleware from './api/middlewares/not-found';
import errorHandlerMiddleware from './api/middlewares/error-handler';
import issueAuthHeader from './api/middlewares/issueAuthHeader';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
viewEngine(app);

app.use(issueAuthHeader);

web.testRoute(app);
web.authRoutes(app);
web.adminRoutes(app);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
