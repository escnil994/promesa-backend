'use strict'

const express = require('express');

require('dotenv').config();

const path = require('path');

const cors = require('cors');

const { dbConnection } = require('./database/config');

//Initializing server
const app = express();

//Cors
app.use(cors());

//Reading and parsing BODY
app.use(express.json());

//Database
dbConnection();

//Public directory

//Routes
app.use('/api/users', require('./routes/user'));

app.use('/api/login', require('./routes/auth'));

app.use('/api/upload', require('./routes/upload'));

app.use('/api/categories', require('./routes/category'));

app.use('/api/products', require('./routes/product'));

app.use('/api/all', require('./routes/search'));

app.use('/api/utils', require('./routes/utils'));

app.use('/api/comments', require('./routes/comment'));

//last

/* app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html'));
});
 */

//Port
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server On port ' + port);
});