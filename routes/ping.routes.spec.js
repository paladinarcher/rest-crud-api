// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('PingRoutes', () => {
  describe('GET: /ping)', () => {
    it('should get pong response', (done) => {
      // Act
      chai
        .request(app)
        .get('/ping')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.text.should.equal('pong');
          done();
        });
    });
  });
});
