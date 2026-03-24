var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Middleware för loggning, JSON-parsning och cookies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Tillåter anrop från alla origins (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    next();
});

// Rutter
app.use('/product', require('./routes/productRoute'));
app.use('/users', require('./routes/usersRoute'));
app.use('/tag', require('./routes/tagsRoute'));
app.use('/api', require('./routes/ratingRoute'));

module.exports = app;