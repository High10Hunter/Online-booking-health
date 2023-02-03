import jwt from 'jsonwebtoken';
import { handleRefreshToken } from '../services/jwt/JwtServices';

const checkIfLoggedIn = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return next();
	}

	const accessToken = authHeader.split(' ')[1];

	jwt.verify(
		accessToken,
		process.env.ACCESS_TOKEN_SECRET,
		async (err, payload) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					const accessToken = await handleRefreshToken(
						req,
						res,
						next
					);

					res.cookie('accessToken', accessToken, {
						maxAge: 1000 * 60 * 60 * 24, //1 day
						httpOnly: true,
					});
				} else if (err.name === 'JsonWebTokenError') {
					if (req.cookies.accessToken) {
						res.clearCookie('accessToken', {
							httpOnly: true,
						});
					}

					if (req.cookies.refreshToken) {
						res.clearCookie('refreshToken', {
							httpOnly: true,
						});
					}

					return res.redirect('auth/login');
				}
			}
			req.payload = payload;
			next();
		}
	);
};

export default checkIfLoggedIn;
