var Chai = require('chai');
var expect = Chai.expect;
var should = Chai.should();

describe('App entry point', function() {
  it('main file should exist', function() {
    should.exist(require('../app.js'));
  })
});
