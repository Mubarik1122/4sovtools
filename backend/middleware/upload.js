const multer = require('multer');
const os = require('os');

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const makeUpload = (allowed, maxMB) =>
  multer({
    dest: os.tmpdir() + '/uploads',
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter: (req, file, cb) =>
      allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type')),
  });

module.exports = { imageUpload: makeUpload(imageTypes, 20), makeUpload };
