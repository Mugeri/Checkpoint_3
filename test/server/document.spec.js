const app = require('../../server');
const request = require('supertest')(app);
const expect = require('chai').expect;

describe('Documents', () => {
  let token;
  const limit = 3;
  const page = 1;
  beforeEach((done) => {
    request
      .post('/api/users/login/')
      .send({
        userName: 'riwhiz',
        password: 'olive',
      })
      .end((err, res) => {
        if (err) {
          console.log('ERROR NI HAPA');
          done(err);
        }
        console.log('TUKO HAPA');
        token = res.body.token;
        done();
      });
  });

  describe('CRUD', () => {
    it('validate created document has date published', (done) => {
      request
        .post('/api/documents/')
        .set({ 'x-access-token': token })
        .send({
          title: 'Testing',
          content: 'I am testing that it shall store the date it is published',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.document).to.exist;
          expect(res.body.document.CreatedAt).to.exist;
          done();
        });
    });
    it('validate documents returned when given a limit', (done) => {
      request
        .get('/api/documents/')
        .query({
          token,
          limit,
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message.docs.length).to.be.equal(limit);
          done();
        });
    });
    it('check documents returned when given a limit and an offset', (done) => {
      request
        .get('/api/documents/')
        .query({
          token,
          limit,
          page,
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message.docs.length).to.be.equal(limit);
          expect(res.body.message.page).to.be.equal(page);
          done();
        });
    });
    it('checks documents are in order from most recent', (done) => {
      request
        .get('/api/documents/')
        .query({
          token,
          limit,
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const first = res.body.message.docs[0].CreatedAt;
          const second = res.body.message.docs[1].CreatedAt;
          const third = res.body.message.docs[2].CreatedAt;
          expect(first).to.be.above(second);
          expect(second).to.be.above(third);
          done();
        });
    });
  });
});
