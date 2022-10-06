'use strict'

const { response } = require("express")


const uuid = require('uuid');

const Category = require('../models/category');

const Product = require('../models/product');

const { uploader } = require("../utils/cloudinary");




const getCategories = async(req, res = response) => {

    const from = Number(req.query.from) || 0;

    const limit = Number(req.query.limit) || 0;


    try {


        const [categories, total] = await Promise.all([
            Category.find({}).skip(from)
            .limit(limit)
            .sort()
            .populate('user', 'name image'),
            Category.countDocuments()
        ]);

        res.status(200).json({
            ok: true,
            categories,
            total,
            'user': req.uid
        });





    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }
}

const getCategory = async(req, res = response) => {

    const code = req.params.code;

    try {

        const categoryFound = await Category.findOne({ code }).populate('user', 'name image');

        if (!categoryFound) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe esta categoría'
            });
        }

        res.status(200).json({
            ok: true,
            categoryFound
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        });
    }
}


const createCategory = async(req, res = response) => {
    const uid = req.uid;

    const code = uuid.v4();

    const { name } = req.body;

    try {
        const categoryNameExist = await Category.findOne({ name });

        if (categoryNameExist) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un categoria con este nombre'
            });

        }

        const category = await new Category({ code: code, user: uid, ...req.body });

        const categorySaved = await category.save();

        res.status(200).json({
            ok: true,
            'caegoría guardada': categorySaved
        });



    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }

}

const updateCategory = async(req, res = response) => {

    const uid = req.uid;

    const id = req.params.id;


    try {

        const categoryFoundById = await Category.findById(id);

        if (!categoryFoundById) {
            return res.status(404).json({
                ok: true,
                msg: 'Esta categoría no existe'
            });

        }

        const data = req.body;

        if (categoryFoundById.name !== data.name) {

            const name = data.name;

            const categoryFoundByName = await Category.findOne({ name });

            if (categoryFoundByName) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe una categoría con este nombre'
                });
            }
        }


        const categoryUpdated = await Category.findByIdAndUpdate(id, data, { new: true, useFindAndModify: false });

        res.status(200).json({
            ok: true,
            categoryUpdated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        })

    }
}

const deleteCategory = async(req, res = response) => {

    const id = req.params.id;

    try {
        const categoryFound = await Category.findById(id);


                if (!categoryFound) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'No existe esta categoría'
                    });
                }

        const product = await Product.findOne({category: id});


        if (product) {
          return res.status(404).json({
            ok: false,
            msg: 'No puedes eliminar esta categoría debido a que contiene al menos un producto'
          })
        }


      const categoryDeleted = await Category.findByIdAndDelete(id);

        await uploader.destroy(categoryDeleted.cloudinary_id)

        res.status(200).json({
            ok: true,
            categoryFound
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        })
    }

}



module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory
}
