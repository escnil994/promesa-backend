'use strict'

const { response } = require('express');

const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next) => {

    const validationError = validationResult(req);

    if (!validationError.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: validationError.mapped()
        })
    }

    next();

}



module.exports = {
    validateFields
}