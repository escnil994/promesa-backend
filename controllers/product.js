'use strict'

const { response, json } = require("express")

const uuid = require('uuid');

const cloudinary = require('../utils/cloudinary');

const Product = require("../models/product");

const Category = require('../models/category');


const { uploader } = require("../utils/cloudinary");

const getProducts = async(req, res = response) => {

    const from = Number(req.query.from) || 0;

    try {

        const [products, total] = await Promise.all([
            Product.find({})
            .populate('user', 'name image').populate('category', 'name image')
            .skip(from)
            .limit(12),
            Product.countDocuments()
        ]);


        res.status(200).json({
            ok: true,
            products,
            total
        });

    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }

}

const getProduct = async(req, res = response) => {

    const code = req.params.code;

    try {

        const productFound = await Product.findOne({ code });

        if (!productFound) {
            return res.status(404).json({
                ok: false,
                msg: 'Este producto no existe'
            });
        }

        res.status(200).json({
            ok: true,
            productFound
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        })

    }
}

const getProductByCategory = async(req, res = response) => {
    const category = req.params.category;

    const from = Number(req.query.from) || 0;


    try {

        const [products] = await Promise.all([
            Product.find({ categoryCode: category })
            .populate('user', 'name image').populate('category', 'image')
            .skip(from)
            .limit(8)
        ]);

        if (!products) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay ningun producto en esta categoria aun'
            });
        }

        res.status(200).send({
            ok: true,
            products,
            total: products.length
        })
    } catch (error) {
        res.status(500).send({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        })
    }
}

const createProduct = async(req, res = response) => {

    const { name, category } = req.body;

    const uid = req.uid;

    const code = uuid.v4();



    try {

        const categoryFound = await Category.findById(category);

        if (!categoryFound) {
            return res.status(404).json({
                ok: false,
                msg: 'No puedes asignar esta categoria por qeu no existe'
            });
        }


        const categoryCode = categoryFound.code;

        const productFound = await Product.findOne({ name });



        if (productFound) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un producto con este nombre'
            });
        }

        const product = await new Product({ code: code, user: uid, categoryCode: categoryCode, ...req.body });

        const productCreated = await product.save();


        res.status(200).json({
            ok: true,
            msg: 'Usuario creado',
            productCreated
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        })

    }
}

const updateProduct = async(req, res = response) => {

    const uid = req.uid;

    const { name } = req.body;

    const id = req.params.id;

    try {

        const productFound = await Product.findById(id);

        if (!productFound) {
            return res.status(404).json({
                ok: false,
                msg: 'Este producto no existe'
            });
        }

        if (name !== productFound.name) {
            const nameProductExist = await Product.findOne({ name });

            if (nameProductExist) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No puedes usar este nombre por que ya existe'
                });
            }
        }

        const productUpdated = await Product.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false });

        res.status(200).json({
            ok: true,
            productUpdated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Erro inesperado, hablar con el administrador'
        });
    }

}

const deleteProduct = async(req, res = response) => {

    const id = req.params.id;

    try {
        const productFound = await Product.findById(id);

        if (!productFound) {
            return res.status(404).json({
                ok: false,
                msg: 'Este producto no existe'
            });
        }

        const productDeleted = await Product.findByIdAndDelete(id, { useFindAndModify: false });

        await uploader.destroy(productDeleted.cloudinary_id);
        await uploader.destroy(productDeleted.cloudinary_id_01);
        await uploader.destroy(productDeleted.cloudinary_id_02);
        await uploader.destroy(productDeleted.cloudinary_id_03);
        await uploader.destroy(productDeleted.cloudinary_id_04);

        res.status(200).json({
            ok: true,
            productDeleted
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }

}


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByCategory
}
