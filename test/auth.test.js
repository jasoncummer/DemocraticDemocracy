const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

process.env.MONGO_URL = 'mongodb://localhost/auth_test';

const app = require('../app');
const User = mongoose.model('User');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Auth routes', function() {
  before(function(done) {
    mongoose.connection.once('open', done);
  });

  beforeEach(async function() {
    await User.deleteMany({});
  });

  after(function(done) {
    mongoose.connection.close(done);
  });

  it('registers a new user and hashes password', function(done) {
    chai.request(app)
      .post('/register')
      .redirects(0)
      .type('form')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'secret'
      })
      .end(async function(err, res) {
        if (err) return done(err);
        expect(res).to.have.status(302);
        expect(res).to.have.header('location', '/dashboard');
        const user = await User.findOne({ email: 'john@example.com' });
        expect(user).to.exist;
        expect(user.password).to.not.equal('secret');
        done();
      });
  });

  it('logs in an existing user', function(done) {
    const hash = bcrypt.hashSync('secret', bcrypt.genSaltSync(10));
    User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: hash
    }).then(() => {
      chai.request(app)
        .post('/login')
        .redirects(0)
        .type('form')
        .send({
          email: 'jane@example.com',
          password: 'secret'
        })
        .end(function(err, res) {
          if (err) return done(err);
          expect(res).to.have.status(302);
          expect(res).to.have.header('location', '/dashboard');
          done();
        });
    }).catch(done);
  });
});
