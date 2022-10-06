'use strict'

const cloudinary = require('../utils/cloudinary');

const User = require('../models/user');

const Category = require('../models/category');

const Product = require('../models/product');

const Banner = require('../models/banner');


const uploadAndSaveImage = async(id, type, file, res) => {

    try {

        switch (type) {
            case 'users':
                const user = await User.findById(id);

                if (!user) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'usuario no existe'
                    });
                }
                await cloudinary.uploader.destroy(user.cloudinary_id);

                const resultUser = await cloudinary.uploader.upload(file, { folder: 'Promesa/users' });

                User.findOneAndUpdate({ _id: id }, {
                    image: resultUser.secure_url,
                    cloudinary_id: resultUser.public_id
                }, { new: true, useFindAndModify: false }, (err, userUpdated) => {
                    if (err || !userUpdated) {
                        return res.status(404).json({
                            ok: false,
                            msg: 'Error al guardar la imagen'
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        data: userUpdated
                    });
                });


                break;
            case 'categories':
                const category = await Category.findById(id);

                if (!category) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'La categoria no existe'
                    });
                }

                await cloudinary.uploader.destroy(category.cloudinary_id);

                const resultCategory = await cloudinary.uploader.upload(file, { folder: 'Promesa/categories' });

                const categoryUpdated = await Category.findOneAndUpdate({ _id: id }, {
                    image: resultCategory.secure_url,
                    cloudinary_id: resultCategory.public_id
                }, { new: true, useFindAndModify: false }, );


                console.log(categoryUpdated);
                if (!categoryUpdated) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Error al guardar la imagen'
                    });
                }

                res.status(200).json({
                    ok: true,
                    data: categoryUpdated
                });


                break;

            case 'products':

                const product = await Product.findById(id);

                if (!product) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Este producto no existe'
                    });
                }

                await cloudinary.uploader.destroy(product.cloudinary_id);

                const resultProduct = await cloudinary.uploader.upload(file, { folder: 'Promesa/products' });

                const productUpdated = await Product.findOneAndUpdate({ _id: id }, {
                    image: resultProduct.secure_url,
                    cloudinary_id: resultProduct.public_id
                }, { new: true, useFindAndModify: false }, );


                if (!productUpdated) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Error al guardar la imagen'
                    });
                }

                res.status(200).json({
                    ok: true,
                    data: productUpdated
                });

                break;

            default:
                break;
        }

    } catch (error) {


        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }



}



const uploadAndSaveImageProduct = async(id, types, option, file, res) => {

    try {

        if (types === 'products') {

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Este producto no existe'
                });
            }

            switch (option) {
                case 'first':

                    await cloudinary.uploader.destroy(product.cloudinary_id_01);

                    const resultProduct01 = await cloudinary.uploader.upload(file, { folder: 'Promesa/products' });

                    Product.findOneAndUpdate({ _id: id }, {

                        image_1: resultProduct01.secure_url,
                        cloudinary_id_01: resultProduct01.public_id
                    }, { new: true, useFindAndModify: false }, (err, productUpdated) => {
                        if (err || !productUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: productUpdated
                        });
                    });


                    break;
                case 'second':
                    await cloudinary.uploader.destroy(product.cloudinary_id_02);

                    const resultProduct02 = await cloudinary.uploader.upload(file, { folder: 'Promesa/products' });

                    Product.findOneAndUpdate({ _id: id }, {

                        image_2: resultProduct02.secure_url,
                        cloudinary_id_02: resultProduct02.public_id
                    }, { new: true, useFindAndModify: false }, (err, productUpdated) => {
                        if (err || !productUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: productUpdated
                        });
                    });

                    break;
                case 'third':
                    await cloudinary.uploader.destroy(product.cloudinary_id_03);

                    const resultProduct03 = await cloudinary.uploader.upload(file, { folder: 'Promesa/products' });

                    Product.findOneAndUpdate({ _id: id }, {

                        image_3: resultProduct03.secure_url,
                        cloudinary_id_03: resultProduct03.public_id
                    }, { new: true, useFindAndModify: false }, (err, productUpdated) => {
                        if (err || !productUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: productUpdated
                        });
                    });

                    break;

                case 'fourth':
                    await cloudinary.uploader.destroy(product.cloudinary_id_04);

                    const resultProduct04 = await cloudinary.uploader.upload(file, { folder: 'Promesa/products' });

                    Product.findOneAndUpdate({ _id: id }, {

                        image_4: resultProduct04.secure_url,
                        cloudinary_id_04: resultProduct04.public_id
                    }, { new: true, useFindAndModify: false }, (err, productUpdated) => {
                        if (err || !productUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: productUpdated
                        });
                    });

                    break;


            }


        }

        if (types === 'banner') {


            const banner = await Banner.findById(id);

            switch (option) {
                case 'first':

                    await cloudinary.uploader.destroy(banner.cloudinary_id_01);

                    const resultBanner01 = await cloudinary.uploader.upload(file, { folder: 'Promesa/banner' });

                    Banner.findOneAndUpdate({ _id: id }, {

                        image_01: resultBanner01.secure_url,
                        cloudinary_id_01: resultBanner01.public_id
                    }, { new: true, useFindAndModify: false }, (err, bannerUpdated) => {
                        if (err || !bannerUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: bannerUpdated
                        });
                    });


                    break;
                case 'second':
                    await cloudinary.uploader.destroy(banner.cloudinary_id_02);

                    const resultBanner02 = await cloudinary.uploader.upload(file, { folder: 'Promesa/banner' });

                    Banner.findOneAndUpdate({ _id: id }, {

                        image_02: resultBanner02.secure_url,
                        cloudinary_id_02: resultBanner02.public_id
                    }, { new: true, useFindAndModify: false }, (err, bannerUpdated) => {
                        if (err || !bannerUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: bannerUpdated
                        });
                    });

                    break;
                case 'third':
                    await cloudinary.uploader.destroy(banner.cloudinary_id_03);

                    const resultBanner03 = await cloudinary.uploader.upload(file, { folder: 'Promesa/banner' });

                    Banner.findOneAndUpdate({ _id: id }, {

                        image_03: resultBanner03.secure_url,
                        cloudinary_id_03: resultBanner03.public_id
                    }, { new: true, useFindAndModify: false }, (err, bannerUpdated) => {
                        if (err || !bannerUpdated) {
                            return res.status(404).json({
                                ok: false,
                                msg: 'Error al guardar la imagen'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            data: bannerUpdated
                        });
                    });


                    break;

                case 'fourth':
                    res.status(200).json({
                        ok: true,
                        msg: 'No puedes cargar mas de 3 imagenes para el banner'
                    })

                    break;


            }

        }



    } catch (error) {


        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }



}


module.exports = {
    uploadAndSaveImage,
    uploadAndSaveImageProduct
}
