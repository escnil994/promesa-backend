'use strict'

const { response } = require('express');

const jsonWebToken = require('jsonwebtoken');


const generateToken = (uid) => {

    const promise = new Promise((resolve, reject) => {
        const payload = {
            uid: uid
        }

        jsonWebToken.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }, (err, token) => {

            if (err) {

                reject('No se puedo generar el token');

            }
            else {
                resolve(token)
            }
        });
    });

    
    return promise;
}


module.exports = {
    generateToken
}