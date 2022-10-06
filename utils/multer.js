'use strict'


const path = require('path');

const multer = require('multer');


module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {

        let ext = path.extname(file.originalname);

        cb(null, true);
    },

});
