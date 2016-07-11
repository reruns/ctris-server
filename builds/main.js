'use strict';

var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var corsOptions = {
  origin: "*" //["http://www.garrettjohnson.net/ctris/"]
};
//This is a bit of a nonstandard use of memcache
var memjs = require('memjs');
var cache = memjs.Client.create();

//Business code.
app.post('/', cors(corsOptions), function (req, res) {
  var game = req.body;
  cache.get('games', function (err, gs) {
    var updated = [];
    if (!!gs && gs.toString() && gs.toString() !== "[]") {
      var games = JSON.parse(gs.toString());
      updated = games;
      updated.push(game);
      updated.sort(compareGame);
      updated = updated.slice(0, 10);
    } else {
      //cache has no values yet.
      updated = [game];
    }
    cache.set('games', JSON.stringify(updated), function (err) {
      if (err) {
        res.json({ error: "Could not submit game." });
      } else {
        res.json({ error: "none" });
      }
    });
  });
});

function compareGame(g1, g2) {
  //Check grades first.
  if (g1.grade === "GM") {
    if (g2.grade === "GM") {
      //if both are GM, we compare times.
      return g1.time <= g2.time;
    } else return -1;
  } else if (g2.grade === "GM") {
    return 1;
  }

  //If neither is GM, we just compare scores, but use time as a tiebreaker
  if (g1.score === g2.score) {
    return g1.time < g2.time;
  } else return g1.score < g2.score;
}

app.get('/', cors(corsOptions), function (req, res) {
  cache.get('games', function (err, result) {
    if (!!result && !err) {
      res.json({ "games": result.toString() });
    } else {
      res.json({ error: "Error getting scores." });
    }
  });
});

app.listen(process.env.PORT || 3111, function () {
  console.log('Leaderboards active!');
});