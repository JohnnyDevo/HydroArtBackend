const multer = require('multer');
const Magic = require('mmmagic').Magic;
const magic = new Magic();

const storage = multer.memoryStorage(); //since I'm just using my database, I'll send the buffer directly to postgres

function fileFilter(req, file, cb) {
    if (file.size > 1000000) {
        cb(null, false);
        return cb(new Error('1MB file size limit (please have mercy on my tiny server)'));
    }
    
    magic.detect(file.buffer, (err, result) => { //why doesn't this have await functionality :(
        if (err) {
            console.warn('error occurred when interpreting file');
            cb(null, false);
            return cb(err);
        }
        console.log(`mmmagic's interpretation of the uploaded file is:`);
        console.log(result);
    });
} 

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
});