'use strict'

const { response } = require('express');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = (req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            status: 'error',
            msg: 'Falta el token en la petición'
        });
    }


    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET)

        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            status: 'error',
            msg: 'El token no es valido'
        });
    }

}


const validateAdminRole = async (req, res = response, next) => {

    const uid = req.uid;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {

            return res.status(404).json({
                status: 'error',
                msg: 'El usuario no existe'
            });
        }

        if (userDB.role !== 'ADMIN') {
            return res.status(403).json({
                status: 'error',
                msg: 'No tienes permiso de administrador'
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: 'Error inesperado, habla con el administrador'
        });
    }
}

const validate_admin_role_or_the_same_user = async (req, res = response, next) => {

    const uid = req.uid;

    const id = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                status: 'error',
                msg: 'Usuario no existe'
            });
        }

        if ((userDB.role === 'ADMIN') || (uid === id)) {

            next();

        } else {

            return res.status(403).json({
                status: 'error',
                msg: 'No tienes permiso para modificar el perfil de otras personas'
            });
        }

    } catch (error) {
        res.status(500).json({
            status: 'error',
            msg: 'Error inesperado, hable con el administrador'
        });

    }

}
module.exports = {
    validateJWT,
    validateAdminRole,
    validate_admin_role_or_the_same_user
};