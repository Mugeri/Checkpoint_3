var app = require('../../server.js');
var request = require('supertest')(app);
var expect = require('chai').expect;

describe('Role', function() {
  var token
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
    it('validates that role is created', function(done) {
      request
        .post('/api/roles/')
        .set({'x-access-token': token })
        .send({
          title: 'Visitor'
        })
        .end(function(err, res) {
          if(err){
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.a('object');
          done()
        })
    })
    it('validates role title is unique', function(done) {
      request
        .post('/api/roles/')
        .set({'x-access-token': token})
        .send({
          title: 'Admin'
        })
        .end(function(err, res) {
          if(err){
            done(err);
          }
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Role already exists!');
          done();
        });
    });
    it('validates that all roles are displayed', function(done) {
      request
        .get('/api/roles/')
        .set({'x-access-token': token})
        .end(function(err, res) {
          if(err){
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.length).to.be.equal(5);
          done();
        });
    });
});
