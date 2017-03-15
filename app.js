var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//
var index = require('./routes/index');
var users = require('./routes/users');

// Database
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('DB_leaderboard');

db.serialize(function () {
    db.run("DROP TABLE IF EXISTS leaderboard;");
    db.run("CREATE TABLE IF NOT EXISTS leaderboard(" +
        "id INTEGER PRIMARY KEY," +
        "name TEXT NOT NULL," +
        "country TEXT NOT NULL," +
        "score INT NOT NULL);");
    // Indexing database to speed-up querys
    db.run("CREATE UNIQUE INDEX name_idx ON leaderboard(name);");
    db.run("CREATE INDEX country_idx ON leaderboard(country);");

    // Some values
    var values = [
        { name: "SegFault", country: "Réunion", score: 1300 },
        { name: "MadMax", country: "France", score: 900 },
        { name: "Leaxus", country: "Laos", score: 300 },
        { name: "Wuattiroro", country: "France", score: 750 }
    ];

    var query = db.prepare("INSERT INTO leaderboard (id, name, country, score) VALUES (NULL, ?, ?, ?)");
    values.forEach(function (row) {
        query.run(row.name, row.country, row.score, function(err) {
            if (err) console.log(err);
        });
    });
});
// Database END

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
