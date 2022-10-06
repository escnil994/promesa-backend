'use strict'


const { Router } = require('express');

const { check } = require('express-validator');

const { getUsers, getUser, createUser, updateUser, deleteUser, updatePassword, getUserByPass } = require('../controllers/user');

const { validateFields } = require('../middlewares/fields-validate');

const { validateJWT, validateAdminRole, validate_admin_role_or_the_same_user } = require('../middlewares/validate-jwt');

const router = Router();


router.get('/:from', validateJWT, validateAdminRole, getUsers);

router.get('/user/:id', validateJWT, getUser);


router.post('/', [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y con formato correcto, ejemplo: usuario@dominio').not().isEmpty().isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty()
    ], validateFields,
    createUser
);

router.put('/:id',
    validateJWT,
    validate_admin_role_or_the_same_user, [
        check('name', 'El nombre no puede estar vacío').not().isEmpty(),
        check('email', 'Por motivos de seguridad, no puedes modificar el correo').not().isEmpty().isEmail(),
    ], validateFields,
    updateUser
);


router.delete('/:id', validateJWT, validateAdminRole, deleteUser);


router.put('/update/:param', updatePassword);

router.get('/userBy/:pass', getUserByPass);



module.exports = router;
