 _____  ______          _____  __  __ ______
|  __ \|  ____|   /\   |  __ \|  \/  |  ____|
| |__) | |__     /  \  | |  | | \  / | |__
|  _  /|  __|   / /\ \ | |  | | |\/| |  __|
| | \ \| |____ / ____ \| |__| | |  | | |____
|_|  \_\______/_/    \_\_____/|_|  |_|______|


INTRODUCTION
------------

This project is a web-service providing a simple leaderboard service.


REQUIREMENTS
------------

This project require the following packages:
    - sqlite3:      npm install --save sqlite3
    - mocha:        npm install --save-dev mocha
    - supertest:    npm install --save-dev supertest
    - vue.js:       available in public/javascripts


HOW TO START
------------

In a terminal, type `npm start`. Make sure your port 3000 isn't already in use.
You can then test your request by using Postman or wget for example.


THE DATABASE
------------

The database `DB_leaderboard` is simply composed of one table `leaderboard`.
leaderboard
├ id        PRIMARY KEY NOT NULL
├ name      TEXT        NOT NULL
├ country   TEXT        NOT NULL
└ score     INT         NOT NULL
Unique index on name
Index on country


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
POST /leaderboard/add/{playerName}: adds a score in the leaderboard
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

- In order to run some tests, simply type `npm test` in a terminal. Tests can be edited in test/test.js.
- A website is also provided.
  WARNING: /leaderboard/add/{playerName} route doesn't work as intended in the browser. When trying to add a new line with a lower score than before, it's added although it shouldn't be.


SCALABITY
---------

In order to speed-up queries and researches, fields `name` and `country` has been indexed.
Tests had been made with 100 000 lines, and performances weren't affected (queries took less than 100ms to be done).