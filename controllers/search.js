'use strict'

const { response } = require('express');

const User = require('../models/user');

const Category = require('../models/category');

const Product = require('../models/product');

const getAll = async(req, res = response) => {

    const search = req.params.search;

    const regularExpression = new RegExp(search, 'i');

    try {

        const [categories, products, users] = await Promise.all([

            Category.find({
                name: regularExpression
            }),
            Product.find({
                name: regularExpression
            })
        ]);

        res.status(200).json({
            ok: true,
            categories,
            products,
            users
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado habla con el administrador'
        });
    }
}

const getByCollections = async(req, res = response) => {

    const collection = req.params.collection;

    const search = req.params.search;

    const regularExpression = new RegExp(search, 'i');

    try {

        let data = [];

        switch (collection) {

            case 'categories':
                data = await Category.find({ name: regularExpression })
                    .populate('user', 'name');
                break;
            case 'products':
                data = await Product.find({
                        name: regularExpression
                    }).populate('user', 'name image')
                    .populate('category', 'name image')

                break;
                case 'users':
                    data = await User.find({
                            name: regularExpression
                        });

                    break;

            default:

                return res.status(400).json({
                    ok: false,
                    msg: 'La coleccion no existe'
                })

        }

        res.status(200).json({
            ok: true,
            results: data
        });


    } catch (error) {

    }

}

const getUsers = async(req, res = response) => {

    const collection = req.params.collection;

    const search = req.params.search;

    const regularExpression = new RegExp(search, 'i');

    try {

        let data = [];

        switch (collection) {
                case 'users':
                    data = await User.find({
                            name: regularExpression
                        });

                    break;
            default:

                return res.status(400).json({
                    ok: false,
                    msg: 'La coleccion no existe'
                })

        }

        res.status(200).json({
            ok: true,
            results: data
        });


    } catch (error) {

    }

}


module.exports = {
    getAll,
    getByCollections,
    getUsers
}
