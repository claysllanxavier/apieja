// Require the dev-dependencies
let chai = require('chai')
let jwt = require('jsonwebtoken')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()
let mongoose = require('mongoose')
var Model = server.models.user

chai.use(chaiHttp)
// Our parent block
let token = jwt.sign({ id: 1 }, process.env.SECRET, {
  expiresIn: 3 // expires in 24 hours
})
// Our parent block
describe('Usuario', () => {
  beforeEach((done) => { // Before each test we empty the database
    Model.remove({}, (err) => {
      done()
    })
  })
  /*
  * Test the TOKEN route
  */
  describe('TOKEN', () => {
    it('it should not access', (done) => {
      chai.request(server)
      .get('/api/usuario')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
  })
  /*
  * Test the /GET route
  */
  describe('/GET', () => {
    it('it should GET', (done) => {
      chai.request(server)
      .get('/api/usuario')
      .set('x-access-token', token)
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
    it('it should not POST one without informacao field', (done) => {
      let item = {}
      item['data'] = {
        nome: 'The Lord of the Rings'
      }
      chai.request(server)
      .post('/api/usuario')
      .send(item)
      .end((err, res) => {
        res.should.have.status(500)
        done()
      })
    })
    it('it should POST', (done) => {
      let item = {}
      item['data'] = {
        nome:'Nome',
        email: 'nome@nome',
        escola: 'IFTO',
        senha: '123'
      }
      chai.request(server)
      .post('/api/usuario')
      .send(item)
      .set('x-access-token', token)
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
    it('it should GET by the given id', (done) => {
      let item = new Model({nome:'Nome',email: 'nome@nome',escola: 'IFTO',senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .get('/api/usuario/' + data._id)
        .send(data)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('nome')
          res.body.should.have.property('email')
          res.body.should.have.property('senha')
          done()
        })
      })
    })
  })

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id', () => {
    it('it should UPDATE given the id', (done) => {
      let item = new Model({nome:'Nome',email: 'nome@nome',escola: 'IFTO',senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .put('/api/usuario/' + data._id)
        .set('x-access-token', token)
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
    it('it should DELETE one given the id', (done) => {
      let item = new Model({nome:'Nome',email: 'nome@nome',escola: 'IFTO',senha: '123'})
      item.save((err, data) => {
        chai.request(server)
        .delete('/api/usuario/' + data._id)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
      })
    })
  })
  /*
  * Test the Login route
  */
  describe('/LOGIN/', () => {
    it('it should Login', (done) => {
      let item = new Model({nome:'Nome',email: 'nome@nome',escola: 'IFTO',senha: '$2a$08$doAoQK7pAH54wH.Lqjq8m.IzaZjw5ebukpYXvHUX59j57oxgZnOoe'})
      item.save((err, data) => {
        chai.request(server)
        .post('/api/login/')
        .send({data:{email: 'nome@nome', senha: '123'}})
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('nome')
          res.body.should.have.property('email')
          res.body.should.have.property('senha')
          done()
        })
      })
    })
  })
})
