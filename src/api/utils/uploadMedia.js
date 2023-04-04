const multer = require('multer');
const path = require('path');

const configureMulter = destinationFolder => {
	const storage = multer.diskStorage({
		destination: destinationFolder,
		filename: function (req, file, cb) {
			cb(
				null,
				file.fieldname +
					'-' +
					Date.now() +
					path.extname(file.originalname)
			);
		},
	});

	const multerInstance = multer({
		storage: storage,
		limits: { fileSize: 1000000 },
		fileFilter: function (req, file, cb) {
			checkFileType(file, cb);
		},
	});

	return multerInstance;
};

// Check file type
function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Images Only!');
	}
}

module.exports = { configureMulter };
