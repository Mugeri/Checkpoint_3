<<<<<<< HEAD
var app = require('../../server.js');
var request = require('supertest')(app);
var expect = require('chai').expect;

describe('Documents', function(){
  var token;
  var limit = 3;
  var page = 1
  beforeEach(function(done) {
    request
      .post('/api/users/login/')
      .send({
          userName: 'riwhiz',
          password: 'olive'
      })
      .end(function(err, res) {
          token = res.body.token;
          done();
      });
  });

  describe('CRUD', function() {
    it('validate created document has date published', function(done) {
      request
        .post('/api/documents/')
        .set({ 'x-access-token': token})
        .send({
          title: 'Testing',
          content: 'I am testing that it shall store the date it is published'
        })
        .end(function(err, res) {
          if(err){
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.document).to.exist;
          expect(res.body.document.CreatedAt).to.exist;
          done();
        });
    });
    it('validate documents returned when given a limit', function(done) {
      request
        .get('/api/documents/')
        .query({
          'token': token,
          'limit': limit
        })
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          expect(res.body.message.docs.length).to.be.equal(limit);
          done();
        });

    });
    it('check documents returned when given a limit and an offset', function(done) {
      request
        .get('/api/documents/')
        .query({
          'token': token,
          'limit': limit,
          'page': page
        })
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          expect(res.body.message.docs.length).to.be.equal(limit);
          expect(res.body.message.page).to.be.equal(page);
          done();
        });

    });
    it('checks documents are in order from most recent', function(done) {
      request
        .get('/api/documents/')
        .query({
          'token': token,
          'limit': limit,
        })
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          var first = res.body.message.docs[0].CreatedAt;
          var second = res.body.message.docs[1].CreatedAt;
          var third = res.body.message.docs[2].CreatedAt;
          console.log(first, second, third);
          expect(first).to.be.above(second);
          expect(second).to.be.above(third);
          done();
        })
    });
  });
});
