const app = require('../../server');
const request = require('supertest')(app);
const expect = require('chai').expect;


describe('User', () => {
  let token;
  beforeEach((done) => {
    request
      .post('/api/users/login/')
      .send({
        userName: 'riwhiz',
        password: 'olive',
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
  describe('Create', () => {
    it('should POST to api/users and create user', (done) => {
      request
          .post('/api/users/')
          .set({ 'x-access-token': token })
          .send({
            userName: 'Test',
            firstName: 'Test',
            lastName: 'Tester',
            email: 'Tester@example.com',
            password: 'Tester',
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.exist;
            expect(res.body).to.be.a('object');
            done();
          });
    });
    it('validates that the new user is unique', (done) => {
      request
        .post('/api/users/')
        .set({ 'x-access-token': token })
        .send({
          userName: 'riwhiz',
          firstName: 'Olive',
          lastName: 'Nyotu',
          email: 'nyotuo16@gmail.com',
          password: 'olive',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(400);
          expect(res.body).to.exist;
          done();
        });
    });
    it('validates that there\'s a role defined', (done) => {
      request
        .post('/api/users/')
        .set({ 'x-access-token': token })
        .send({
          userName: 'Test3',
          firstName: 'Check',
          lastName: 'Role',
          email: 'roles@test.com',
          password: 'maroles'
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.user.role).to.exist;
          expect(res.body).to.be.a('object');
          done();
        });
    });
    it('validate user created both first & last name', (done) => {
      request
        .post('/api/users/')
        .set({ 'x-access-token': token })
        .send({
          userName: 'Test4',
          firstName: 'Check',
          lastName: 'Names',
          email: 'names@test.com',
          password: 'majina',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.user.name.first).to.exist;
          expect(res.body.user.name.last).to.exist;
          done();
        });
    });
  });
  describe('User display', () => {
    it('validates that all users are returned', (done) => {
      request
        .get('/api/users/')
        .query({ token })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.users.length).to.be.equal(12);
          done();
        });
    });
  });
});
