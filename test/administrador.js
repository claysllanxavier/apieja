// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()
let mongoose = require('mongoose')
var Model = server.models.admin

chai.use(chaiHttp)
// Our parent block

// Our parent block
describe('Administrador', () => {
  beforeEach((done) => { // Before each test we empty the database
    Model.remove({}, (err) => {
      done()
    })
  })
  /*
  * Test the /GET route
  */
  describe('/GET', () => {
    it('it should GET all the administradores', (done) => {
      chai.request(server)
      .get('/api/admin')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.length.should.be.eql(0)
        done()
      })
    })
  })

  /*
  * Test the /POST route
  */
  describe('/POST', () => {
    it('it should not POST a administrador without senha field', (done) => {
      let item ={};
       item["data"] = {
        nome: 'The Lord of the Rings'
      }
      chai.request(server)
      .post('/api/admin')
      .send(item)
      .end((err, res) => {
        res.should.have.status(500)
        done()
      })
    })
    it('it should POST a administrador ', (done) => {
      let item ={};
       item["data"] = {
        nome: 'Claysllan Xavier',
        email: 'claysllan@gmail.com',
        senha: '123'
      }
      chai.request(server)
      .post('/api/admin')
      .send(item)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
    })
  })

  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id', () => {
    it('it should GET a administrador by the given id', (done) => {
      let item = new Model({ nome: 'The Lord of the Rings', email: 'J.R.R. Tolkien', senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .get('/api/admin/' + data._id)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('nome')
          res.body.should.have.property('email')
          res.body.should.have.property('senha')
          res.body.should.have.property('_id')
          done()
        })
      })
    })
  })

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id', () => {
    it('it should UPDATE a administrador given the id', (done) => {
      let item = new Model({ nome: 'The Lord of the Rings', email: 'J.R.R. Tolkien', senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .put('/api/admin/' + data._id)
        .send({data: {nome: 'The Chronicles of Narnia', email: 'C.S. Lewis'}})
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
      })
    })
  })

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id', () => {
    it('it should DELETE a administrador given the id', (done) => {
      let item = new Model({ nome: 'The Lord of the Rings', email: 'J.R.R. Tolkien', senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .delete('/api/admin/' + data._id)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
      })
    })
  })
  /*
  * Test the /PUT/:id route
  */
  describe('/CHANGEPASS', () => {
    it('it should UPDATE a administrador given the senha', (done) => {
      let item = new Model({ nome: 'The Lord of the Rings', email: 'J.R.R. Tolkien', senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .post('/api/minhaconta/senha')
        .send({data: {'senha': '456', '_id': data._id}})
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
      })
    })
  })
})
