import express from 'express';
import viewEngine from '../api/config/viewEngine';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
viewEngine(app);

app.get('/client', (req, res) => {
	res.render('index', {
		layout: './client/master',
	});
});

app.get('/admin', (req, res) => {
	res.render('index');
});

export default app;
