'use strict'

const { Router } = require('express');

const { getBanner } = require('../controllers/frontend-utils');

const router = Router();


router.get('/', getBanner);


module.exports = router;