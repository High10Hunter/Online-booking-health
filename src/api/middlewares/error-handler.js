const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const errorHandler = (err, req, res, next) => {
	return res
		.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
		.render('./errors/error-handler', {
			layout: './errors/error-handler',
			Title: 'Xảy ra lỗi',
			message: err.message,
		});
};

module.exports = errorHandler;
