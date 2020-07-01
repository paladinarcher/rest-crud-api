// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('SwaggerRoutes', () => {
  describe('GET: /)', () => {
    it('should get swagger-ui page', (done) => {
      // Act
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          // Assert
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
    });
  });
});
