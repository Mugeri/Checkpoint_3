var app = require('../../server.js');
var request = require('supertest')(app);
var expect = require('chai').expect;


describe('User', function() {
  var token;
  var user_id;
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
  describe('CRUD User Operations', function() {
      describe('Create', function() {
          it('should POST to api/users and create user', function(done) {
              request
                  .post('/api/users/')
                  .set({'x-access-token': token})
                  .send({
                      userName: "Test",
                      name: {
                          first: 'Test',
                          last: 'Tester'
                      },
                      email: "Tester@example.com",
                      password: "Tester"
                  })
                  // .expect(200)
                  .end(function(err, res) {
                      expect(res.status).to.exist;
                      expect(res.body).to.exist;
                      expect(res.body).to.be.a('object');
                      // user_id = res.body.user._id;

                      done();
                  });
          });
          it('validates that the new user is unique', function() {
            request
              .post('api/users/')
              .set({'x-access-token': token})
              .send({
                  userName: "riwhiz",
                  name: {
                      first: 'Olive',
                      last: 'Nyotu'
                  },
                  email: "nyotuo16@gmail.com",
                  password: "olive"
              })
              .end(function(err, res) {
                  expect(res.status).to.be(400);
                  expect(res.body).to.exist;
                  done();
              });
          });
          it('validates that theres a role defined', function() {
            request
              .post('api/users/')
              .set({'x-access-token': token})
              .send({
                  userName: "Test3",
                  name: {
                      first: 'Check',
                      last: 'Role'
                  },
                  email: "roles@test.com",
                  password: "maroles"
              })
              .end(function(err, res) {
                  expect(res.status).to.be(400);
                  expect(res.body.role).to.exist;
                  done();
              });
          });
          it('validates that user created both first and last name', function() {
            request
              .post('api/users/')
              .set({'x-access-token': token})
              .send({
                  userName: "Test4",
                  name: {
                      first: 'Check',
                      last: 'Names'
                  },
                  email: "names@test.com",
                  password: "majina"
              })
              .end(function(err, res) {
                  expect(res.status).to.be(400);
                  expect(res.body.name.first).to.exist;
                  expect(res.body.name.last).to.exist;
                  done();
              });
          });
        });
    });
    describe('User display', function() {
      it('validates that all users are returned', function() {
        request
          .get('api/users/')
          .set({ 'x-access-token': token })
          .end(function(err, res) {
            expect(res.status).to.be(200);
            console.log(res.body.users.length);
            expect(res.body.users.length).to.be(9)
          })
      });
    });

});
