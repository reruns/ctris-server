'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//This is a bit of a nonstandard use of memcache
var memjs = require('memjs');
var cache = memjs.Client.create();

//Business code.
app.post('/', function (req, res) {
  var game = req.body;
  cache.get('games', function (err, gs) {
    var updated = [];
    if (!!gs) {
      var games = JSON.parse(gs.toString());
      while (games.length > 0) {
        var g = games.pop();
        if (compareGame(game, g)) {
          updated.unshift(g);
        } else {
          updated = updated.concat(games);
          games = [];
        }
      }
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
    } else return true;
  } else if (g2.grade === "GM") {
    return false;
  }

  //If neither is GM, we just compare scores, but use time as a tiebreaker
  if (g1.score === g2.score) {
    return g1.time < g2.time;
  } else return g1.score < g2.score;
}

app.get('/', function (req, res) {
  cache.get('games', function (err, result) {
    console.log(result);
    console.log(result.toString());
    if (!!result && !err) {
      res.json(JSON.parse(result.toString()));
    } else {
      res.json({ error: "Error getting scores." });
    }
  });
});

app.listen(process.env.PORT || 3111, function () {
  console.log('Leaderboards active!');
});