var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Database
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('DB_leaderboard');

/* GET home page. */
app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/leaderboard/top', function (req, res) {
    db.all("SELECT * FROM leaderboard ORDER BY score DESC LIMIT 3", function (err, rows) {
        if (err) {
            res.status(500).send({ error: err });
        } else {
            res.send({ standing: rows });
        }
    });
});

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
            res.send({ standing: rows });
        }
    });
});

app.get('/leaderboard/topcountry/:country', function (req, res) {
    db.all("SELECT name, score " +
        "FROM leaderboard WHERE country = '" + req.params.country + "' " +
        "ORDER BY score DESC " +
        "LIMIT 3", function (err, rows) {
        if (err) {
            res.status(500).send({error: err});
        } else if (rows.length == 0) {
            res.status(404).send("Country '" + req.params.country + "' not found.");
        } else {
            res.send({ standing: rows });
        }
    });
});

app.post('/leaderboard/add/:playerName', function (req, res) {
    var name = req.params.playerName;
    var score = req.body.score;
    var country = req.body.country;
    var query = db.prepare("INSERT INTO leaderboard (name, score, country) VALUES (?, ?, ?)");
    query.run(name, score, country, function(err) {
        if (err) {
            res.status(500).send({ error: err });
        }
    });
    res.send("Score added.");
});

module.exports = app;
