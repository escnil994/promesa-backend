'use strict'

const { Router } = require('express');
const { check } = require('express-validator');

const { getProducts, createProduct, getProductByCategory, getProduct, updateProduct, deleteProduct } = require('../controllers/product');

const { validateJWT, validateAdminRole } = require('../middlewares/validate-jwt');

const { validateFields } = require('../middlewares/fields-validate');


const router = Router();

router.get('/:from', getProducts);

router.get('/product/:code', getProduct);

router.get('/category/:category/:form', getProductByCategory)


router.post('/', [
        validateJWT,
        validateAdminRole,
        check('name', 'El nombre es requerido').not().isEmpty(),
        check('description', 'La descripcion es requerida').not().isEmpty(),
        check('price', 'Debe asignar un precio a este producto').not().isEmpty().isNumeric(),
        check('category', 'Debe asignar este producto a una categoría').not().isEmpty().isMongoId(),
        validateFields,
    ],
    createProduct
);

router.put('/:id', [
        validateJWT,
        validateAdminRole,
        check('name', 'El nombre no puede estar vacío').not().isEmpty(),
        check('description', 'La descripción es requerida').not().isEmpty(),
        check('price', 'Debe asignar un precio a este producto').not().isEmpty().isNumeric(),
        check('category', 'Debe asignar este producto a una categoría').not().isEmpty().isMongoId(),
        validateFields,
    ],
    updateProduct
);

router.delete('/:id', validateJWT, validateAdminRole, deleteProduct);





module.exports = router;