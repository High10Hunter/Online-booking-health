import createError from 'http-errors';
import RolesEnum from '../enums/RolesEnum';

const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.payload) {
			next(createError.Unauthorized('Bạn không có quyền truy cập'));
		}

		const rolesArr = [...allowedRoles];
		//check if user role is in allowed roles
		if (!rolesArr.includes(req.payload.role)) {
			const roleListKeys = Object.keys(RolesEnum);

			return res.redirect(
				`/${roleListKeys[req.payload.role].toLowerCase()}`
			);
		}

		next();
	};
};

export default verifyRoles;
