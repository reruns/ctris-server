if (process.env.NODE_ENV == "dev") {require('dotenv').config();}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//pg setup
const pg = require('pg');
const db_config = {
  host: process.env.DATABASE_URL,
  ssl: process.env.USE_SSL,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30000
}
var pool = new pg.Pool(db_config);

//Business code.
app.post('/', (req,res) => {
  const {score, time, initials, grade} = req.body;
  pool.query('INSERT INTO runs(score,time,initials,grade) VALUES($1,$2,$3,$4)'
               ,[score, time, initials, grade], (err, result) => {
    console.log(err);
    console.log(result);
  });
});

app.get('/', (req, res) => {
  console.log('get received.')
  pool.query("(SELECT initials, TO_CHAR(time, 'MI:SS.MS'), score, grade FROM runs WHERE grade = 'GM' ORDER BY time) UNION ALL (SELECT initials, TO_CHAR(time, 'MI:SS.MS'), score, grade FROM runs WHERE grade != 'GM' ORDER BY score DESC)",
  (err, result) => {
    console.log('processing query.');
    if(err) {
      console.log(err)
    } else {
      console.log('responding...');
      res.json({list: result.rows})
    }
  });
});

app.listen(process.env.PORT || 3111, function () {
  console.log('Leaderboards active!');
});
