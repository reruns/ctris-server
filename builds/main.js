'use strict';

require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

//pg setup
var pg = require('pg');
var db_config = {
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(db_config);

//Business code.
app.get('/score/:id', function (req, res) {});
app.post('/score', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool.');
    }
    var _req$body = req.body;
    var score = _req$body.score;
    var time = _req$body.time;
    var initials = _req$body.initials;
    var grade = _req$body.grade;

    client.query('INSERT INTO runs(score,time,initials,grade) VALUES($1,$2,$3,$4)', [score, time, initials, grade], function (err, result) {
      done();
      console.log(err);
      console.log(result);
    });
  });
});

app.get('/scores', function (req, res) {});

app.listen(3111, function () {
  console.log('Example app listening on port 3111!');
});