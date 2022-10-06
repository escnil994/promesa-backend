'use strict'

const { Router } = require('express');

const { getAll, getByCollections, getUsers } = require('../controllers/search');

const { validateJWT, validateAdminRole } = require('../middlewares/validate-jwt');

const { route } = require('./auth');





const router = Router();

router.get('/:search', getAll);

router.get('/:collection/:search', getByCollections);

router.get('/pro/:collection/:search', validateJWT, validateAdminRole, getUsers)


module.exports = router;
