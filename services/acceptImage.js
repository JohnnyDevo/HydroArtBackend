const multer = require('multer');
const mmm = require('mmmagic');
const Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE);

const storage = multer.memoryStorage(); //since I'm just using my database, I'll send the buffer directly to postgres

function fileFilter(req, file, cb) {
    if (testMimetype(file.mimetype)) { //before file is received, test declared mimetype
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .bmp format allowed!'));
      }
}

function interpretFile(req, res, next) { //analyze the file to find actual type
    magic.detect(req.file.buffer, (err, result) => { 
        if (err) {
            console.warn('error occurred when interpreting file');
            next(err);
        }
        if (testMimetype(result)) { //test actual mimetype
            next();
        } else {
            console.warn('invalid image');
            next(new Error());
        }
    });
}

function testMimetype(mimetype) {
    if (mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/bmp") { //only accept basic image types
        return true;
    } else {
        return false;
    }
}

const limits = {
    files: 1,
    fileSize: 1000000,
    fields: 1,
    parts: 2
}

module.exports = {
    acceptFile: multer({
        storage, storage,
        fileFilter: fileFilter,
        limits: limits
    }),
    interpretFile: interpretFile
};