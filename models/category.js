'use strict'

const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    code: {
        type: String,
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
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dorqesogu/image/upload/v1611201292/Promesa/categories/thumbnail_ivlzmb.png'
    },
    user: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    cloudinary_id: {
        type: String,
        default: '0dde0de0de'
    }
});

CategorySchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Categories', CategorySchema);
