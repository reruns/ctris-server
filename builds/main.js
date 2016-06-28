'use strict';

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/score/:id', function (req, res) {});
app.post('/score', function (req, res) {});
app.get('/scores', function (req, res) {});

app.listen(3111, function () {
  console.log('Example app listening on port 3111!');
});