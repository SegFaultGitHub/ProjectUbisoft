README

INTRODUCTION
------------

This project is a web-service providing a simple leaderboard service.


REQUIREMENTS
------------

This project require the following packages:
    - sqlite3:      npm install --save sqlite3
    - mocha:        npm install --save-dev mocha
    - supertest:    npm install --save-dev supertest
    - vue.js        available in public/javascripts


THE DATABASE
------------

The database is simply composed of one table `leaderboard`.
leaderboard
├ id        PRIMARY KEY NOT NULL
├ name      TEXT        NOT NULL
├ country   TEXT        NOT NULL
└ score     INT         NOT NULL


ROUTES
------

GET /leaderboard/all: returns all scores in the leaderboard
    Status 500: unhandled error
    Status 200: OK
GET /leaderboard/top: returns the 3 best scores
    Status 500: unhandled error
    Status 200: OK
GET /leaderboard/rank/{playerName}: returns the best score of {playerName}
    Status 500: unhandled error
    Status 404: player not found
    Status 200: OK
GET /leaderboard/topcountry/{country}: returns the 3 best score from {country}
    Status 500: unhandled error
    Status 404: country not found
    Status 200: OK
POST /leaderboard/add/{playerName}: add a score in the leaderboard
    IF {playerName} doesn't have a score THEN
        add the score
    ELSE
        IF {playerName} already has a score THEN
            IF {playerName} has a lower a score THEN
                add a new score
            ELSE
                doesn't add the score

    Status 500: unhandled error
    Status 200: OK


TESTS
-----

- In order to run some tests, simply type npm test in a terminal.
- A website is also provided.
  WARNING: /leaderboard/add/{playerName} route doesn't work as intended in the browser. When trying to add a new line
  with lower score than before, it's added although it shouldn't be.


SCALABITY
---------

In order to speed-up querys and researches, fields `name` and `country` has been indexed.