'use strict'

const { Router } = require('express');

const { newComment, getComments, getComment, updateCommet, deletecomment } = require('../controllers/comment');

const { validateJWT, validateAdminRole } = require('../middlewares/validate-jwt');

const router = Router();


router.get('/:from?', getComments);

router.get('/comment/:id', validateJWT, getComment);

router.post('/', validateJWT, newComment);

router.put('/:id', validateJWT, updateCommet);

router.delete('/:id', validateJWT, deletecomment);

module.exports = router;