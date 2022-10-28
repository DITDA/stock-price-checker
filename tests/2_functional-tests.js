const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(10000);

  suite('GET /api/stock-prices => stockData object', () => {
    test('1 stock', done => {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.symbol, 'GOOG');
          done();
        });
    });

    test('1 stock with like', done => {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: 'true' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, 1); 
          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', done => {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: 'true' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test('2 stocks', done => {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          done();
        });
    });

    test('2 stocks with like', done => {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'], like: 'true' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isNumber(res.body.stockData[0].rel_likes);
          done();
        });
    });
  });
});
