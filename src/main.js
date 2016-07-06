const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//This is a bit of a nonstandard use of memcache
const memjs = require('memjs')
const cache = memjs.Client.create()

//Business code.
app.post('/', (req,res) => {
  const game = req.body
  console.log(game)
  cache.get('games', (err, games) => {
    let updated = []
    if (!!games) {
      glist = games.list
      while (glist.length > 0) {
        let g = glist.pop()
        if (compareGame(game, g)) {
          updated.unshift(g)
        } else {
           updated = updated.concat(glist)
           glist = []
        }
      }
      updated = updated.slice(0,10)
    } else {
      //cache has no values yet.
      updated = [game]
    }
    cache.set('games',{list: updated}, (err) => {
      if (err) {res.json({error: "Could not submit game."})}
      else {res.json({error:"none"})}
    });
  })
});

app.get('/reset', (req, res) => {
  cache.set('games',{list: []}, (err) => {});
  res.json({status: 'reset'})
});

function compareGame(g1, g2) {
  //Check grades first.
  if (g1.grade === "GM") {
    if (g2.grade === "GM") {
      //if both are GM, we compare times.
      return (g1.time <= g2.time)
    } else return true
  } else if (g2.grade === "GM") {
    return false
  }

  //If neither is GM, we just compare scores, but use time as a tiebreaker
  if (g1.score === g2.score) {
    return (g1.time < g2.time)
  } else return (g1.score < g2.score)
}

app.get('/', (req, res) => {
  cache.get('games', (err, result) => {
    if (result) {
      res.json(result.list)
    } else {
      res.json({error: "Error getting scores."})
    }
  })
});

app.listen(process.env.PORT || 3111, function () {
  console.log('Leaderboards active!');
});
