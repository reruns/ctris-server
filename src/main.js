const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json({type: "*/*"}));

let corsOptions = {
  origin : "http://www.garrettjohnson.net"
}
//This is a bit of a nonstandard use of memcache
const memjs = require('memjs')
const cache = memjs.Client.create()

//Business code.
app.post('/', cors(corsOptions), (req,res) => {
  const game = req.body
  cache.get('games', (err, gs) => {
    if(err) {
      res.json({error: "Error getting scores."})
    } else {
      let updated = []
      if (!!gs && gs.toString() && gs.toString() !== "[]") {
        let games = JSON.parse(gs.toString())
        updated = games
        updated.push(game)
        updated.sort(compareGame)
        updated = updated.slice(0,22)
      } else {
        //cache has no values yet.
        updated = [game]
      }
      cache.set('games',JSON.stringify(updated), (err) => {
        if (err) {res.json({error: "Could not submit game."})}
        else {
          res.json({"games": updated})
        }
      });
    }
  })
});

function compareGame(g1, g2) {
  //Check grades first.
  if (g1.grade === "GM") {
    if (g2.grade === "GM") {
      //if both are GM, we compare times.
      return (g1.time <= g2.time)
    } else return -1
  } else if (g2.grade === "GM") {
    return 1
  }

  //If neither is GM, we just compare scores, but use time as a tiebreaker
  if (g1.score === g2.score) {
    return (g1.time < g2.time)
  } else return (g1.score < g2.score)
}

app.get('/', cors(corsOptions), (req, res) => {
  cache.get('games', (err, result) => {
    if (!!result && !err) {
      res.json({"games": result.toString()})
    } else {
      res.json({error: "Error getting scores."})
    }
  })
});

app.listen(process.env.PORT || 3111, function () {
  console.log('Leaderboards active!');
});
