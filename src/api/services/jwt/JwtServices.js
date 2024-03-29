import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../../models';
import { Sequelize } from 'sequelize';

// authentication
const signAccessToken = userData => {
	return new Promise((resolve, reject) => {
		const payload = {
			id: userData.id,
			name: userData.name,
			role: userData.role,
			avatar: userData.avatar,
		};
		const secret = process.env.ACCESS_TOKEN_SECRET;
		const options = {
			expiresIn: '1h',
		};

		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err);
			}
			resolve(token);
		});
	});
};

const verifyAccessToken = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return res.redirect('/auth/login');
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
						maxAge: 86400000, //1 day
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
			//populate payload of authenticated user
			res.locals.authUser = payload;
			next();
		}
	);
};

const handleRefreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		if (req.cookies.accessToken) {
			res.clearCookie('accessToken', {
				httpOnly: true,
			});
		}

		return res.redirect('auth/login');
	}

	const user = await User.findOne({
		where: {
			refresh_token: {
				[Sequelize.Op.contains]: [refreshToken],
			},
		},
	});

	//Detect reuse of refresh token
	if (!user) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, payload) => {
				if (err) {
					res.clearCookie('refreshToken', {
						httpOnly: true,
					});
				}

				const hackedUser = User.find({
					where: {
						id: payload.id,
					},
				});

				hackedUser.refresh_token = [];
				await hackedUser.save();
			}
		);

		return res.redirect('/auth/login');
	}

	const newRefreshTokenArr = user.refresh_token.filter(
		item => item !== refreshToken
	);

	return new Promise((resolve, reject) => {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, payload) => {
				if (err) {
					//token expired
					user.refresh_token = [...newRefreshTokenArr];
					await user.save();
				}

				if (err || user.id !== payload.id) {
					reject(createError.Forbidden('Invalid refresh token'));
				}

				const accessToken = await signAccessToken({
					id: user.id,
					name: user.name,
					role: user.role,
					avatar: user.avatar,
				});

				const newRefreshToken = jwt.sign(
					{
						id: user.id,
					},
					process.env.REFRESH_TOKEN_SECRET,
					{
						expiresIn: '1d',
					}
				);

				user.refresh_token = [...newRefreshTokenArr, newRefreshToken];
				await user.save();

				res.cookie('refreshToken', newRefreshToken, {
					maxAge: 24 * 60 * 60 * 1000, //1 day
					httpOnly: true,
				});

				resolve(accessToken);
			}
		);
	});
};

// appoinment services
const signAppointmentToken = (appointment_id, customer_id, schedule_id) => {
	return new Promise((resolve, reject) => {
		const payload = {
			appointment_id,
			customer_id,
			schedule_id,
		};
		const secret = process.env.ACCESS_TOKEN_SECRET;
		const options = {
			expiresIn: '1h',
		};

		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				reject(err);
			}
			resolve(token);
		});
	});
};

const verifyAppointmentToken = token => {
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		return decoded;
	} catch (error) {
		return false;
	}
};

export {
	signAccessToken,
	verifyAccessToken,
	handleRefreshToken,
	signAppointmentToken,
	verifyAppointmentToken,
};
