'use strict'

const { Schema, model } = require('mongoose');

const userschema = Schema({
    name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        default: ''
    },
    genre: {
        type: String,
        default: ''
    },
    dui:{
      type: String
    },
    direction: {
      type: String,
      default: ''
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        default: ''
    },
    whatsapp: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dorqesogu/image/upload/v1610174445/Promesa/users/qy9vg0hb8tm0fijj7wq7.jpg'
    },
    role: {
        type: String,
        require: true,
        default: 'USER'
    },
    google: {
        type: Boolean,
        default: false
    },
    cloudinary_id: {
        type: String,
        default: '0dde0de0de'
    },
    commented: {
      type: Boolean,
      default: false
    },
    changePassword:{
        type: Boolean,
        default: false
    }
});


userschema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;

    return object;
});


module.exports = model('Users', userschema);
