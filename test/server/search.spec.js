var app = require('../../server.js');
var request = require('supertest')(app);
var expect = require('chai').expect;

describe('Search', function() {
  var token;
  var limit = 10;
  var page = 1;
  var date = '2016-09-14';
  beforeEach(function(done) {
    request
      .post('/api/users/login/')
      .send({
          userName: 'ganjez',
          password: 'alex'
      })
      .end(function(err, res) {
          token = res.body.token;
          done();
      });
  })
  it('get documents with limit, offset by role', function(done) {
    request
      .get('/api/documents/')
      .query({
        'token': token,
        'limit': limit,
        'page': page
      })
      .end(function(err, res) {
        if(err) {
          return done(err);
        }
        expect(res.body.message.docs.length).to.be.equal(7);
        done();

      })

  });
  it('get documents with limit, offset by date', function(done) {
    request
      .get('/api/documents/')
      .query({
        'token': token,
        'limit': limit,
        'page': page,
        'published': date
      })
      .end(function(err, res) {
        if(err) {
          return done(err);
        }
        expect(res.body.message.docs.length).to.be.equal(7);
        done();

      })

  })
})
