'use strict'

const mongoose = require('mongoose');

const dbString = process.env.DB;

const dbConnection = async () => {
    try {
        await mongoose.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Database is connected successfuly!!!');
    } catch (error) {
        console.log(error);
        throw new Error('Error starting DataBase, see logs!!!')

    }
}

module.exports = { dbConnection };