var app = require('../../server.js');
var request = require('supertest')(app);
var expect = require('chai').expect;


describe('User', function() {
  var token;
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
    describe('Create', function() {
        it('should POST to api/users and create user', function(done) {
            request
                .post('/api/users/')
                .set({'x-access-token': token})
                .send({
                    userName: 'Test',
                    firstName: 'Test',
                    lastName: 'Tester',
                    email: 'Tester@example.com',
                    password: 'Tester'
                })
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.exist;
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
        it('validates that the new user is unique', function(done) {
          request
            .post('/api/users/')
            .set({'x-access-token': token})
            .send({
                userName: 'riwhiz',
                firstName: 'Olive',
                lastName: 'Nyotu',
                email: 'nyotuo16@gmail.com',
                password: 'olive'
            })
            .end(function(err, res) {
              if(err) {
                console.log(err);
                return done(err)
              }
              expect(res.status).to.be.equal(400);
              expect(res.body).to.exist;
              done();
            });
        });
        it('validates that there\'s a role defined', function(done) {
          request
            .post('/api/users/')
            .set({'x-access-token': token})
            .send({
                userName: 'Test3',
                firstName: 'Check',
                lastName: 'Role',
                email: 'roles@test.com',
                password: 'maroles'
            })
            .expect(200)
            .end(function(err, res) {
              if(err) {
                return done(err);
              }
                expect(res.body.user.role).to.exist;
                expect(res.body).to.be.a('object');
                done();
            });
        });
        it('validate user created both first & last name', function(done) {
          request
            .post('/api/users/')
            .set({'x-access-token': token})
            .send({
                userName: 'Test4',
                firstName: 'Check',
                lastName: 'Names',
                email: 'names@test.com',
                password: 'majina'
            })
            .end(function(err, res) {
              if(err){
                return done(err);
              }
                expect(res.status).to.be.equal(200);
                expect(res.body.user.name.first).to.exist;
                expect(res.body.user.name.last).to.exist;
                done();
            });
        });
      });
  describe('User display', function() {
    it('validates that all users are returned', function(done) {
      request
        .get('/api/users/')
        .query({'token': token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err){
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.users.length).to.exist;
          expect(res.body.users.length).to.be.equal(12);
          done();
        });
    });
  });
});
