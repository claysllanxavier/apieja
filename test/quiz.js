// Require the dev-dependencies
let chai = require('chai')
let jwt = require('jsonwebtoken')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()
let mongoose = require('mongoose')
var Model = server.models.conteudo

chai.use(chaiHttp)
// Our parent block
let token = jwt.sign({ id: 1 }, process.env.SECRET, {
  expiresIn: 3 // expires in 24 hours
})
// Our parent block
describe('Quiz', () => {
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
      .get('/api/conteudo/1/pergunta')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
    })
  })
  /*
  * Test the /POST route
  */
  describe('/POST', () => {
    it('it should POST', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let item = {}
        item['data'] = {
          pergunta: 'The Lord of the Rings',
          respostaCerta: '123',
          respostas: ["1", "2", "3", "4"]
        }
        chai.request(server)
        .post('/api/conteudo/'+data._id+'/pergunta')
        .send(item)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
      })
    })
  })

  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id', () => {
    it('it should GET one by the given id', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien', perguntas: [{pergunta: 'The Lord of the Rings',respostaCerta: '123',respostas: ["1", "2", "3", "4"]}]})
      aux.save((err, data) => {
        chai.request(server)
        .get('/api/conteudo/' + data._id + '/pergunta/' + data.perguntas[0]._id)
        .send(data)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('pergunta')
          res.body.should.have.property('_id')
          res.body.pergunta.should.have.property('pergunta')
          res.body.pergunta.should.have.property('respostas')
          res.body.pergunta.should.have.property('respostaCerta')
          done()
        })
      })
    })
  })
  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id', () => {
    it('it should UPDATE', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien', perguntas: [{pergunta: 'The Lord of the Rings',respostaCerta: '123',respostas: ["1", "2", "3", "4"]}]})
      aux.save((err, data) => {
        chai.request(server)
        .put('/api/conteudo/' + data._id + '/pergunta/' + data.perguntas[0]._id)
        .set('x-access-token', token)
        .send({data: {pergunta: 'The Chronicles of Narnia', respostaCerta: 'C.S. Lewis'}})
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
    it('it should DELETE', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien', perguntas: [{pergunta: 'The Lord of the Rings',respostaCerta: '123',respostas: ["1", "2", "3", "4"]}]})
      aux.save((err, data) => {
        chai.request(server)
        .delete('/api/conteudo/' + data._id + '/pergunta/' + data.perguntas[0]._id)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
      })
    })
  })
})
