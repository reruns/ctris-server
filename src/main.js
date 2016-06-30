const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//Business code.
app.post('/', (req,res) => {
  const {score, time, initials, grade} = req.body;
  //'INSERT INTO runs(score,time,initials,grade) VALUES($1,$2,$3,$4)',[score, time, initials, grade]
});

app.get('/', (req, res) => {
  //"(SELECT initials, TO_CHAR(time, 'MI:SS.MS'), score, grade FROM runs WHERE grade = 'GM' ORDER BY time) UNION ALL (SELECT initials, TO_CHAR(time, 'MI:SS.MS'), score, grade FROM runs WHERE grade != 'GM' ORDER BY score DESC)",
  res.json({list: result})
});

app.listen(process.env.PORT || 3111, function () {
  console.log('Leaderboards active!');
});
