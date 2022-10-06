'use strict'

const { Router } = require('express');

const { uploadImage, uploadImageProduct } = require('../controllers/upload');

const expressFileUpload = require('express-fileupload');

const { validateJWT, validateAdminRole } = require('../middlewares/validate-jwt');

const upload = require('../utils/multer');

const router = Router();



router.post('/:type/:id', validateJWT, upload.single('image'), uploadImage);

router.post('/:type/:option/:id', validateJWT, validateAdminRole, upload.single('file0'), uploadImageProduct);





module.exports = router;
