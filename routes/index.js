var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Database
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('DB_leaderboard');

// GET home page
app.get('/', function(req, res) {
    res.render('index', { title: 'Leaderboard' });
});

// GET all scores
app.get('/leaderboard/all', function (req, res) {
    db.all("SELECT name, country, score FROM leaderboard ORDER BY score", function (err, rows) {
        if (err) {
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ standing: rows });
        }
    });
});

// GET the 3 best scores
app.get('/leaderboard/top', function (req, res) {
    db.all("SELECT name, country, score FROM leaderboard ORDER BY score DESC LIMIT 3", function (err, rows) {
        if (err) {
            res.status(500).send({ error: err });
        } else {
            res.status(200).send({ standing: rows });
        }
    });
});

// GET the best score of {playerName}
app.get('/leaderboard/rank/:playerName', function (req, res) {
    db.all("SELECT l1.name, l1.score, " +
        "(SELECT count() + 1 FROM (SELECT * FROM leaderboard l2 WHERE l2.score > l1.score)) rank, " +
        "(SELECT count() FROM leaderboard) total " +
        "FROM leaderboard l1 WHERE l1.name = '" + req.params.playerName + "' " +
        "ORDER BY rank ASC", function (err, rows) {
        if (err) {
            res.status(500).send({error: err});
        } else if (rows.length == 0) {
            res.status(404).send("Player '" + req.params.playerName + "' not found.");
        } else {
            res.status(200).send({ standing: rows });
        }
    });
});

// GET the 3 best score from {country}
app.get('/leaderboard/topcountry/:country', function (req, res) {
    db.all("SELECT name, score " +
        "FROM leaderboard WHERE country = '" + req.params.country + "' " +
        "ORDER BY score DESC " +
        "LIMIT 3", function (err, rows) {
        if (err) {
            res.status(500).send({ error: err });
        } else if (rows.length == 0) {
            res.status(404).send("Country '" + req.params.country + "' not found.");
        } else {
            res.status(200).send({ standing: rows });
        }
    });
});

/* Add a score in the leaderboard
 IF {playerName} doesn't have a score THEN
    add the score
 ELSE
    IF {playerName} has a score THEN
        IF {playerName} has a lower a score THEN
            add a new score
        ELSE
            doesn't add the score
  */
app.post('/leaderboard/add/:playerName', function (req, res) {
    var name = req.params.playerName;
    var score = req.body.score;
    var country = req.body.country;
    if (score < 0) {
        res.status(500).send({ error: "score < 0" });
    } else {
        var queryStr =
            "INSERT OR REPLACE\n" +
            "INTO leaderboard (\n" +
            "    id,\n" +
            "    name,\n" +
            "    country,\n" +
            "    score\n" +
            ")\n" +
            "VALUES (\n" +
            "    NULL,\n" +
            "    ?,\n" +
            "    ?,\n" +
            "    COALESCE(MAX((SELECT score FROM leaderboard WHERE name = '" + name + "' LIMIT 1), ?), " + score + ")\n" +
            ")";
        var query = db.prepare(queryStr);
        query.run(name, country, score, function (err) {
            if (err) {
                res.status(500).send({ error: err });
            } else {
                res.status(200).send("Score added.");
            }
        });
    }
});

module.exports = app;
