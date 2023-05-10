require('dotenv').config();
import app from './app';
import connectDB from './api/config/connectDB';

//testing route
// import test from './src/tests/test';

const { PORT } = process.env || 3000;

connectDB();

const server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

process.on('SIGINT', () => {
	server.close(() => console.log(`exits server express`));
});
