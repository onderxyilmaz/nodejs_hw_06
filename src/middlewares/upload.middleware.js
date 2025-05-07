const multer = require('multer');
const createHttpError = require('http-errors');

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createHttpError(400, 'Sadece resim dosyaları yüklenebilir! (jpg, png, gif, vb.)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('photo');

// Özel hata yakalama middleware'i
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(createHttpError(400, 'Dosya boyutu 5MB\'dan büyük olamaz!'));
      }
      return next(createHttpError(400, 'Dosya yükleme hatası: ' + err.message));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = uploadMiddleware; 