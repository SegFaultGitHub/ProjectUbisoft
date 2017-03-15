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
    db.run("DROP TABLE leaderboard");
    db.run("CREATE TABLE IF NOT EXISTS leaderboard (" +
        "name TEXT NOT NULL," +
        "country TEXT NOT NULL," +
        "score INT NOT NULL)");

    var values = [
        { name: "Thomas", country: "Réunion", score: 900 },
        { name: "Thomas", country: "Réunion", score: 1300 },
        { name: "Maxime", country: "France", score: 1300 },
        { name: "Maxime", country: "France", score: 800},
        { name: "Alex", country: "Laos", score: 300 },
        { name: "Alex", country: "Laos", score: 1000 },
        { name: "Roman", country: "France", score: 750 },
        { name: "Roman", country: "France", score: 900 }
    ];

    var query = db.prepare("INSERT INTO leaderboard (name, country, score) VALUES (?, ?, ?)");
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
