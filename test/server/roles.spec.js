const app = require('../../server');
const request = require('supertest')(app);
const expect = require('chai').expect;

describe('Role', () => {
  let token;
  let id;
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
    it('validates that role is created', (done) => {
      request
        .post('/api/roles/')
        .set({ 'x-access-token': token })
        .send({
          title: 'Visitor',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.a('object');
          done();
        });
    });
    it('validates role title is unique', (done) => {
      request
        .post('/api/roles/')
        .set({ 'x-access-token': token })
        .send({
          title: 'Admin'
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Role already exists!');
          done();
        });
    });
  });
  describe('VIEW', () => {
    it('validates that all roles are displayed', (done) => {
      request
        .get('/api/roles/')
        .set({ 'x-access-token': token })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          console.log('RES IS: ', res.body[4]);
          expect(res.status).to.be.equal(200);
          expect(res.body.length).to.be.equal(5);
          id = res.body[4]._id;
          done();
        });
    });
  });
  describe('EDIT', () => {
    it('updates the role according to the id given', (done) => {
      request
        .put(`/api/roles/${id}`)
        .query({ token })
        .send({
          title: 'Temporary',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          console.log(res.body.message);
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });
});
