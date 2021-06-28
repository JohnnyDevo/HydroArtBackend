const multer = require('multer');

const storage = multer.memoryStorage(); //since I'm just using my database, I'll send the buffer directly to postgres

function fileFilter(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/bmp") { //only accept basic image types
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .bmp format allowed!'));
      }
}

const limits = {
    files: 1,
    fileSize: 1000000,
    fields: 1,
    parts: 2
}

module.exports = multer({
    storage, storage,
    fileFilter: fileFilter,
    limits: limits
});