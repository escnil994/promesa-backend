'use strict'

const { Schema, model } = require('mongoose');

const BannerSchema = Schema({

    title: {
        type: String,
        require: true
    },
    image_01: {
        type: String,
        default: 'https://res.cloudinary.com/dorqesogu/image/upload/v1611201292/Promesa/categories/thumbnail_ivlzmb.png'
    },
    cloudinary_id_01: {
        type: String,
        default: '0dde0de0de'
    },
    image_02: {
        type: String,
        default: 'https://res.cloudinary.com/dorqesogu/image/upload/v1611201292/Promesa/categories/thumbnail_ivlzmb.png'
    },
    cloudinary_id_02: {
        type: String,
        default: '0dde0de0de'
    },
    image_03: {
        type: String,
        default: 'https://res.cloudinary.com/dorqesogu/image/upload/v1611201292/Promesa/categories/thumbnail_ivlzmb.png'
    },
    cloudinary_id_03: {
        type: String,
        default: '0dde0de0de'
    },
    user: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

BannerSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Banners', BannerSchema);