var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/product', require('./routes/productRoute'));
app.use('/users', require('./routes/usersRoute'));
app.use('/tag', require('./routes/tagsRoute'));

module.exports = app;
