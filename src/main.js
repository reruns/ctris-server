const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/score/:id', (req, res) => {});
app.post('/score', (req,res) => {});
app.get('/scores', (req, res) => {});

app.listen(3111, function () {
  console.log('Example app listening on port 3111!');
});
