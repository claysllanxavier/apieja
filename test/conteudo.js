//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
var Model = server.models.videos;

chai.use(chaiHttp);
//Our parent block

//Our parent block
describe('Conteudo', () => {
  beforeEach((done) => { //Before each test we empty the database
    Model.remove({}, (err) => {
      done();
    });
  });
  /*
  * Test the /GET route
  */
  describe('/GET', () => {
    it('it should GET all the conteudos', (done) => {
      chai.request(server)
      .get('/api/conteudo')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  /*
  * Test the /POST route
  */
  describe('/POST', () => {
    it('it should not POST a conteudo without informacao field', (done) => {
      let item = {
        conteudo: "The Lord of the Rings"
      }
      chai.request(server)
      .post('/api/conteudo')
      .send(item)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
    });
    it('it should POST a conteudo ', (done) => {
      let item = {
        conteudo: "The Lord of the Rings",
        informacao: "J.R.R. Tolkien"
      }
      chai.request(server)
      .post('/api/conteudo')
      .send(item)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id', () => {
    it('it should GET a conteudo by the given id', (done) => {
      let item = new Model({ conteudo: "The Lord of the Rings", informacao: "J.R.R. Tolkien"});
      item.save((err, data) => {
        chai.request(server)
        .get('/api/conteudo/' + data._id)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('conteudo');
          res.body.should.have.property('informacao');
          res.body.should.have.property('_id');
          done();
        });
      });
    });
  });

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id', () => {
    it('it should UPDATE a book given the id', (done) => {
      let item = new Model({ conteudo: "The Lord of the Rings", informacao: "J.R.R. Tolkien"});
      item.save((err, data) => {
        chai.request(server)
        .put('/api/conteudo/' + data._id)
        .send({conteudo: "The Chronicles of Narnia", informacao: "C.S. Lewis"})
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id', () => {
    it('it should DELETE a book given the id', (done) => {
      let item = new Model({ conteudo: "The Lord of the Rings", informacao: "J.R.R. Tolkien"});
      item.save((err, data) => {
        chai.request(server)
        .delete('/api/conteudo/' + data._id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });
    });
  });

});
