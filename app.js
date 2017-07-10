var express = require('express');
var app = express();
var contacts = require('./routes/contacts');

app.use('/contacts', contacts);
module.exports = app;