const issueAuthHeader = (req, res, next) => {
	if (req.cookies.accessToken) {
		req.headers['authorization'] = `Bearer ${req.cookies.accessToken}`;
	}
	next();
};

module.exports = issueAuthHeader;
