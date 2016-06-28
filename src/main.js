require('dotenv').config();
const express = require('express');
const app = express();

const pg = require('pg');
const db_config = {
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10
  idleTimeoutMillis: 30000
}
var pool = new pg.Pool(db_config);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//The whole app!
app.get('/score/:id', (req, res) => {});
app.post('/score', (req,res) => {


});

app.get('/scores', (req, res) => {});

app.listen(3111, function () {
  console.log('Example app listening on port 3111!');
});
