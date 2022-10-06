'use strict'

const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    details: {
        type: String,
    },
    price: {
        type: Number,
        require: true
    },
    discount: {
        type: Number,
        default: 0
    },

    image: {
        type: String,
        default: 'ertuyiasdf'
    },
    cloudinary_id: {
        type: String,
        default: 'sdfghjklma'
    },
    image_1: {
        type: String,
        default: 'ertuyiasdf'
    },
    cloudinary_id_01: {
        type: String,
        default: 'sdfghjklma'
    },
    image_2: {
        type: String,
        default: 'ertuyiasdf'
    },
    cloudinary_id_02: {
        type: String,
        default: 'sdfghjklma'
    },
    image_3: {
        type: String,
        default: 'ertuyiasdf'
    },
    cloudinary_id_03: {
        type: String,
        default: 'sdfghjklma'
    },
    image_4: {
        type: String,
        default: 'ertuyiasdf'
    },
    cloudinary_id_04: {
        type: String,
        default: 'sdfghjklma'
    },
    category: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    categoryCode: {
        require: true,
        type: String
    },
    status: {
        type: String,
        default: "yes"
    },
    user: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

ProductSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Products', ProductSchema);
