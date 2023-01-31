import express from 'express';
import web from './api/routes';
import viewEngine from './api/config/viewEngine';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
viewEngine(app);

web.adminRoutes(app);

export default app;
