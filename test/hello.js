var expect = require('chai').use(require('sinon-chai')).expect;
var hello = require('../src/scripts/hello');

describe('hello.js', function() {
  describe('"hello"', function() {
    it('say "hello!"', function(done) {
      var robot = {
        respond: function(pattern, callback) {
          expect(pattern.test('hello')).to.be.true;
          var res = {
            send: function(message) {
              expect(message).to.equal('hello!');
              done();
            }
          };
          callback(res);
        }
      };
      hello(robot)
    });
  });
});
