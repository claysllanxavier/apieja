// Require the dev-dependencies
let chai = require('chai')
let jwt = require('jsonwebtoken')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()
let mongoose = require('mongoose')
var Model = server.models.conteudo
var models = server.models

chai.use(chaiHttp)
// Our parent block

let token = jwt.sign({ id: 1 }, process.env.SECRET, {
  expiresIn: 3 // expires in 24 hours
})

// Our parent block
describe('Video', () => {
  beforeEach((done) => { // Before each test we empty the database
    server.models.video.remove({}, (err) => {
      done()
    })
  })
  /*
  * Test the TOKEN route
  */
  describe('TOKEN', () => {
    it('it should not access', (done) => {
      chai.request(server)
      .get('/api/conteudo/1/video')
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
    it('it should not POST one without field', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let item = {}
        item['data'] = {
          nome: 'The Lord of the Rings'
        }
        chai.request(server)
        .post('/api/conteudo/'+ data._id + '/video')
        .set('x-access-token', token)
        .send(item)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
      })
    })
    it('it should not POST with wrong url', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let item = {}
        item['data'] = {
          nome: 'The Lord of the Rings',
          url: 'The Lord of the Rings'
        }
        chai.request(server)
        .post('/api/conteudo/'+ data._id + '/video')
        .set('x-access-token', token)
        .send(item)
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
      })
    })
    it('it should POST', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let item = {}
        item['data'] = {
          nome: 'The Lord of the Rings',
          url: 'https://www.youtube.com/watch?v=z2E-nVi-Pys'
        }
        chai.request(server)
        .post('/api/conteudo/'+ data._id + '/video')
        .set('x-access-token', token)
        .send(item)
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
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let video = new models.video({nome: 'The Lord of the Rings', url: 'https://www.youtube.com/watch?v=z2E-nVi-Pys', conteudo: data._id})
        video.save((err, instance) =>{
        chai.request(server)
        .get('/api/conteudo/' + data._id + '/video/' + instance._id)
        .set('x-access-token', token)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          res.body.should.have.property('nome')
          res.body.should.have.property('url')
          done()
        })
        })
      })
    })
  })
  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id', () => {
    it('it should not UPDATE', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let video = new models.video({nome: 'The Lord of the Rings', url: 'https://www.youtube.com/watch?v=z2E-nVi-Pys', conteudo: data._id})
        video.save((err, instance) =>{
        chai.request(server)
        .put('/api/conteudo/' + data._id + '/video/' + instance._id)
        .set('x-access-token', token)
        .send({data: {nome: 'The Chronicles of Narnia', url: 'C.S. Lewis'}})
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
        })
      })
    })
    it('it should UPDATE', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let video = new models.video({nome: 'The Lord of the Rings', url: 'https://www.youtube.com/watch?v=z2E-nVi-Pys', conteudo: data._id})
        video.save((err, instance) =>{
        chai.request(server)
        .put('/api/conteudo/' + data._id + '/video/' + instance._id)
        .set('x-access-token', token)
        .send({data: {nome: 'The Chronicles of Narnia', url: 'https://www.youtube.com/embed/EQp1NapFqts'}})
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
        })
      })
    })
  })
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id', () => {
    it('it should DELETE', (done) => {
      let aux = new Model({ conteudo: 'The Lord of the Rings', informacao: 'J.R.R. Tolkien'})
      aux.save((err, data) => {
        let video = new models.video({nome: 'The Lord of the Rings', url: 'https://www.youtube.com/watch?v=z2E-nVi-Pys', conteudo: data._id})
        video.save((err, instance) =>{
        chai.request(server)
        .delete('/api/conteudo/' + data._id + '/video/' + instance._id)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
        })
      })
    })
  })
})
