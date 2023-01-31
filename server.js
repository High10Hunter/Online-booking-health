require('dotenv').config();
import app from './src/app';
import connectDB from './src/api/config/connectDB';

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
