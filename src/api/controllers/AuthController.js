import { User } from '../../api/models';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { signAccessToken } from '../services/jwt/JwtServices';
import { Sequelize } from 'sequelize';

const index = (req, res) => {
	if (req.payload) {
		return res.redirect(`/${req.payload.role}`);
	}

	res.render('auth/login', {
		layout: './auth/login',
		title: 'Đăng nhập',
	});
};

const login = async (req, res, next) => {
	try {
		const { username, password, remember_me } = req.body;

		const user = await User.findOne({
			where: {
				username: username,
				status: true,
			},
		});

		if (!user) {
			return res.render('auth/login', {
				layout: './auth/login',
				title: 'Đăng nhập',
				message: 'Tài khoản hoặc mật khẩu không đúng',
			});
		}

		const isMatch = await user.isValidPassword(password);

		if (!isMatch) {
			return res.render('auth/login', {
				layout: './auth/login',
				title: 'Đăng nhập',
				message: 'Tài khoản hoặc mật khẩu không đúng',
			});
		}

		const accessToken = await signAccessToken(
			user.id,
			user.name,
			user.getRole()
		);

		//store access token in cookie
		res.cookie('accessToken', accessToken, {
			maxAge: 86400000, //1 day
			httpOnly: true,
		});

		if (remember_me) {
			const newRefreshToken = jwt.sign(
				{
					id: user.id,
				},
				process.env.REFRESH_TOKEN_SECRET,
				{
					expiresIn: '1d',
				}
			);

			//check whether refresh token is already stored in db and remove it
			let newRefreshTokenArr = [];
			if (!req.cookies.refreshToken) {
				newRefreshTokenArr = user.refresh_token;
			} else {
				newRefreshTokenArr = user.refresh_token.filter(
					item => item !== req.cookies.refreshToken
				);
			}

			if (req.cookies.refreshToken) {
				const currentRefreshToken = req.cookies.refreshToken;
				const refreshTokenInDB = user.refresh_token.find(
					item => item === currentRefreshToken
				);

				//Detect reusing refresh token
				if (!refreshTokenInDB) {
					// clear out ALL previous refresh tokens
					newRefreshTokenArr = [];
				}

				res.clearCookie('refreshToken', {
					httpOnly: true,
				});
			}

			//save new refresh token to database
			user.refresh_token = [...newRefreshTokenArr, newRefreshToken];
			await user.save();

			//store new refresh token in cookie
			res.cookie('refreshToken', newRefreshToken, {
				maxAge: 86400000, //1 day
				httpOnly: true,
			});
		}

		// // redirect to index page
		// return res.render(`./${role}/index`, {
		// 	layout: `./${role}/index`,
		// });

		return res.redirect('/authed');
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	if (!req.cookies.accessToken) {
		return res.redirect('/auth/login');
	} else {
		res.clearCookie('accessToken', {
			httpOnly: true,
		});
	}

	const refreshToken = req.cookies.refreshToken;
	const user = await User.findOne({
		where: {
			refresh_token: {
				[Sequelize.Op.contains]: [refreshToken],
			},
		},
	});

	if (!user) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
		});

		return res.redirect('/auth/login');
	}

	user.refresh_token = user.refresh_token.filter(
		item => item !== refreshToken
	);
	await user.save();

	res.clearCookie('refreshToken', {
		httpOnly: true,
	});

	return res.redirect('/auth/login');
};

export default { index, login, logout };
