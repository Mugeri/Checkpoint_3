const app = require('../../server');
const request = require('supertest')(app);
const expect = require('chai').expect;

describe('Documents', () => {
  let token;
  let id;
  let id2;
  const wrongId = '57dfb733f0e3e70fd416cb2';
  const limit = 4;
  const page = 1;
  const published = '2016-09-20';
  beforeEach((done) => {
    request
      .post('/api/users/login/')
      .send({
        userName: 'riwhiz',
        password: 'olive',
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        token = res.body.token;
        done();
      });
  });

  describe('CREATE', () => {
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
  });
  describe('READ', () => {
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
          id = res.body.message.docs[3]._id;
          id2 = res.body.message.docs[2]._id
          expect(first).to.be.above(second);
          expect(second).to.be.above(third);
          done();
        });
    });
    it('check documents returned when given a limit, an offset and a date', (done) => {
      request
        .get('/api/documents/')
        .query({
          token,
          limit,
          page,
          published,
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.message.docs[0].CreatedAt).to.be.at.least(published);
          expect(res.body.message.docs.length).to.be.equal(limit);
          expect(res.body.message.page).to.be.equal(page);
          done();
        });
    });
  });
  describe('get specific document', () => {
    it('should return document with given id', (done) => {
      request
        .get(`/api/documents/${id}`)
        .query({
          token,
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.title).to.exist;
          done();
        });
    });
    // it('should return an error if id is wrong', (done) => {
    //   request
    //     .get(`/api/documents/${wrongId}`)
    //     .query({ token })
    //     .end((err, res) => {
    //       if (err) {
    //         return done(err);
    //       }
    //       console.log('RES IS: ', res.body);
    //       expect(res.status).to.be.equal(400);
    //       expect(res.body.err).to.exist;
    //       expect(res.body.name).to.not.exist;
    //       done();
    //     });
    // });
  });
  describe('update a document', () => {
    it('should not update if there\'s no token', (done) => {
      request
        .put(`/api/documents/${id}`)
        .send({
          title: 'This is the updated document',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          console.log(res.body);
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.exist;
          expect(res.body.message).to.be.equal('Unauthorized User!');
          done();
        });
    });
    it('should not update if access is not owner', (done) => {
      request
        .put(`/api/documents/${id}`)
        .query({ token })
        .send({
          title: 'This is the updated document',
        })
        .end((err,res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.exist;
          expect(res.body.message).to.be.equal('Cannot edit this document!');
          done();
        });
    });
    it('should update if it\'s the owner editing', (done) => {
      request
        .put(`/api/documents/${id2}`)
        .query({ token })
        .send({
          title: 'This is the updated document',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.exist;
          expect(res.body.message).to.be.equal('Document updated!');
          done();
        });
    });
  });
  describe('Delete', () => {
    it('should not delete document if there\'s no token', (done) => {
      request
        .delete(`/api/documents/${id2}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Unauthorized User!');
          done();
        });
    });
    it('should delete the document with the given Id', (done) => {
      request
        .delete(`/api/documents/${id2}`)
        .query({ token })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('Successfully deleted');
          done();
        });
    })
  });
});
