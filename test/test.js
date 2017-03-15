var assert = require('assert');
var request = require('supertest');
var app = require('../app');


describe('Routes', function() {
    describe('GET /leaderboard/top', function () {
        it('status should be 200', function (done) {
            request(app)
                .get('/leaderboard/top')
                .expect(200, done);
        });
    });
    describe('GET /void', function () {
        it('status should be 404', function (done) {
            request(app)
                .get('/void')
                .expect(404, done);
        });
    });
    describe('GET /leaderboard/rank/{playerName} with existant playerName', function () {
       it ('status should be 200', function (done) {
           request(app)
               .get('/leaderboard/rank/SegFault')
               .expect(200, done);
       });
    });
    describe('GET /leaderboard/rank/{playerName} with absent playerName', function () {
        it ('status should be 200', function (done) {
            request(app)
                .get('/leaderboard/rank/null')
                .expect(404, done);
        });
    });
    describe('POST /leaderboard/add/{playerName} with correct score', function () {
        it ('status should be 200', function (done) {
            request(app)
                .post('/leaderboard/add/null')
                .send({ 'score':  200, 'country': 'USA' })
                .expect(200, done)
        });
    });
    describe('POST /leaderboard/add/{playerName} with incorrect score', function () {
        it ('status should be 500', function (done) {
            request(app)
                .post('/leaderboard/add/null')
                .send({ 'score':  -1000, 'country': 'USA' })
                .expect(500, done)
        });
    });
});