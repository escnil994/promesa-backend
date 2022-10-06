'use strict'

const { Router } = require('express');


const { check } = require('express-validator');


const { validateFields } = require('../middlewares/fields-validate');

const { validateJWT } = require('../middlewares/validate-jwt')


const router = Router();


const { login, googleSignIn, tokenRenew, recoverPassword } = require('../controllers/auth');


router.post(
    '/', [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        validateFields
    ],
    login
);


router.post(
    '/google', [
        check('token', 'Google token is required').not().isEmpty(),
        validateFields
    ],
    googleSignIn
);

router.get('/renew', validateJWT, tokenRenew);

router.post('/recover', recoverPassword);


module.exports = router;
