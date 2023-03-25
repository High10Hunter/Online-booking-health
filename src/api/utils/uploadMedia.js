const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: 'src/public/media/',
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});

// Init upload
const upload = fieldName =>
	multer({
		storage: storage,
		limits: { fileSize: 1000000 },
		fileFilter: function (req, file, cb) {
			checkFileType(file, cb);
		},
	}).single(fieldName);

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

const uploadMedia = fieldName => {
	return (req, res, next) => {
		upload('avatar')(req, res, err => {
			if (err) {
				res.send(err);
			} else {
				if (req.file) {
					const avatarPath = req.file.path;
					req.body.avatar = avatarPath;

					next();
				}
			}
		});
	};
};

module.exports = { uploadMedia };
