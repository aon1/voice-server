var express = require('express');
var app = express();
var contacts = require('./routes/contacts');
var users = require('./routes/users');
var batch = require('./routes/batch');

app.use('/contacts', contacts);
app.use('/users', users);
app.use('/batch', batch);
module.exports = app;