// Setup multer (files will temporarily be saved in the "temp" folder).
const multer = require("multer");


const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'upload');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});

const upload = multer({
    storage:storage
});

// Export the "upload" object, which we can use to actually accept file uploads.
module.exports = upload;