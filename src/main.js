require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//pg setup
const pg = require('pg');
const db_config = {
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30000
}
var pool = new pg.Pool(db_config);

//Business code.
app.get('/score/:id', (req, res) => {});
app.post('/score', (req,res) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool.');
    }
    const {score, time, initials, grade} = req.body;
    client.query('INSERT INTO runs(score,time,initials,grade) VALUES($1,$2,$3,$4)'
                 ,[score, time, initials, grade], (err, result) => {
      done();
      console.log(err);
      console.log(result);
    });
  })
});

app.get('/scores', (req, res) => {});

app.listen(3111, function () {
  console.log('Example app listening on port 3111!');
});
