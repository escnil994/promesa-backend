'use strict'


const { Router } = require('express');

const { check } = require('express-validator');

const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category');

const { validateFields } = require('../middlewares/fields-validate');

const { validateJWT, validateAdminRole, validate_admin_role_or_the_same_user } = require('../middlewares/validate-jwt');

const router = Router();


router.get('/:from', getCategories);

router.get('/category/:code', getCategory)

router.post(
    '/', [
        validateJWT,
        validateAdminRole,
        check('name', 'Debes escribir un nombre para esta categoría').not().isEmpty(),
        validateFields
    ],
    createCategory
);

router.put(
    '/:id', [
        validateJWT,
        validateAdminRole,
        check('name', 'Debes escribir un nombre para esta categoría').not().isEmpty(),
        check('description', 'La descripción de la categoria es necesaria').not().isEmpty(),
        validateFields
    ],
    updateCategory
);

router.delete(
    '/:id',
    validateJWT,
    validateAdminRole,
    deleteCategory
);




module.exports = router;
