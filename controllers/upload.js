'use strict'

const { response } = require('express');

const User = require('../models/user');

const { uploadAndSaveImage, uploadAndSaveImageProduct } = require('../helpers/image-upload');

const uploadImage = async(req, res = response) => {



    const type = req.params.type;

    const id = req.params.id;

    try {


        const validTypes = ['users', 'categories', 'products'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo seleccionado no es valido'
            });
        }


        if (!req.file) {
            return res.status(400).json({
                ok: false,
                msg: 'No ha seleccionado ninguna imagen'
            });
        }

        const fileName = req.file.originalname;

        const cutName = fileName.split('.');

        const extensionFile = cutName[cutName.length - 1];

        const validExtension = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'ico'];


        if (!validExtension.includes(extensionFile)) {
            return res.status(400).json({
                ok: false,
                msg: 'La extensión no es válida'
            });
        }

        if (id) {

            uploadAndSaveImage(id, type, req.file.path, res);


        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        });
    }





}

const uploadImageProduct = async(req, res = response) => {

    const types = req.params.type;

    const option = req.params.option;


    const id = req.params.id;

    try {

        const validTypes = ['products', 'banner'];

        if (!validTypes.includes(types)) {
            return res.status(400).json({
                ok: false,
                msg: 'El tipo seleccionado no es valido'
            });
        }

        const validOptions = ['first', 'second', 'third', 'fourth'];

        if (!validOptions.includes(option)) {
            return res.status(400).json({
                ok: false,
                msg: 'La opcion seleccionada no es valida'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                ok: false,
                msg: 'No ha seleccionado ninguna imagen'
            });
        }

        const fileName = req.file.originalname;

        const cutName = fileName.split('.');

        const extensionFile = cutName[cutName.length - 1];

        const validExtension = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'ico'];


        if (!validExtension.includes(extensionFile)) {
            return res.status(400).json({
                ok: false,
                msg: 'La extensión no es válida'
            });
        }

        if (id) {

            uploadAndSaveImageProduct(id, types, option, req.file.path, res);

        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        });
    }
}





module.exports = {
    uploadImage,
    uploadImageProduct
}
