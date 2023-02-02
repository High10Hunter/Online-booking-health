const notFound = (req, res) => {
	res.status(404).render('./errors/not-found-404', {
		layout: './errors/not-found-404',
		Title: 'Không tìm thấy trang',
	});
};

module.exports = notFound;
