const app = require('../../server');
const request = require('supertest')(app);
const expect = require('chai').expect;

describe('Search', () => {
  let token;
  const limit = 10;
  const page = 1;
  const date = '2016-09-15';
  beforeEach((done) => {
    request
      .post('/api/users/login/')
      .send({
        userName: 'ganjez',
        password: 'alex',
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
  it('get documents with limit, offset by role', (done) => {
    request
      .get('/api/documents/')
      .query({
        token,
        limit,
        page,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message.docs.length).to.be.equal(7);
        done();
      });
  });
  it('get documents with limit, offset by date', (done) => {
    request
      .get('/api/documents/')
      .query({
        token,
        limit,
        page,
        date,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message.docs.length).to.be.equal(7);
        done();
      });
  });
});
