var mcrypt = require ('./mcrypt')
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var should = require('chai').should();

describe('mcrypt', function() {
  describe('listAlgorithms', function () {
    it('should return all available algorithms', function () {
      mcrypt.listAlgorithms().should.deep.equal(['rijndael-128', 'rijndael-192', 'rijndael-256']);
    });
  });

  describe('listModes', function () {
    it('should return all available modes', function () {
      mcrypt.listModes().should.deep.equal(['ecb', 'cbc', 'cfb', 'ncfb', 'nofb', 'ctr']);
    });
  });

  describe('getBlockSize', function () {
    it('should return false if cipher does not exist', function () {
      mcrypt.getBlockSize('fakeCipher').should.be.false;
    });

    it('should return block size for all ciphers', function () {
      mcrypt.getBlockSize('rijndael-128').should.equal(16);
      mcrypt.getBlockSize('rijndael-192').should.equal(24);
      mcrypt.getBlockSize('rijndael-256').should.equal(32);
    });
  });

  describe('getIVSize', function () {
    it('should return false if cipher does not exist', function () {
      mcrypt.getIVSize('fakeCipher').should.be.false;
    });

    it('should return iv size for all ciphers', function () {
      mcrypt.getIVSize('rijndael-128').should.equal(16);
      mcrypt.getIVSize('rijndael-192').should.equal(24);
      mcrypt.getIVSize('rijndael-256').should.equal(32);
    });
  });

  describe('getKeySize', function () {
    it('should return false if cipher does not exist', function () {
      mcrypt.getKeySize('fakeCipher').should.be.false;
    });

    it('should return iv size for all ciphers', function () {
      mcrypt.getKeySize('rijndael-128').should.equal(32);
      mcrypt.getKeySize('rijndael-192').should.equal(32);
      mcrypt.getKeySize('rijndael-256').should.equal(32);
    });
  });

  describe('decrypt', function () {
    it('should give the exact same result as libmcrypt', function () {
      var expectedText = "hello how are you this is supposed to be long to surpass the 256 block limit so yeah let's go it's gonna take a while how are you today--hello how are you this is supposed to be long to surpass the 256 block limit so yeah let's go it's gonna take a while how are you today";
      var key = new Buffer("LFQzLSJEeCROXy1heS9nNHlVKFpuNEU1KXE1RGl5RXM=", "base64").toJSON().data;
      var iv = new Buffer("COzHeanbKXqtrBBq5n0tuw==", "base64").toJSON().data;
      var cipher = new Buffer("dWUr0Qx0UsUwlhJgXtv05CfK0w7j13q4t5zEg6AXD4SMONfDkiJx9TchUnVZ9wJNDId3K2bR+CzYuuHe9GVT7hed3AH7qXti3zOB/WbtXNn0mJTeA3GtCccXk5FAys8lkwMZzExPfKKKj0wR9zeUNNp7w9xcoYcENVNCy/eE8kb8e3qQgbBDKIse4ejqwQaAZx4O/odal4Zs9lzI22RB6AVT+19oPC6uZ36gLviVDehtF64YGqwTPFh/ux46OWIFczG7XUwtzqtNNTDvAFrvofdN+Jgk8yzp8MuDDd301f25VvMdHZgj/mXdrzrZkBEbAuHBZ1TUTGl5OBHN3OWHwy8HoFzMKZrEmETjrQVd68Q=", "base64").toJSON().data;
      var clearText = new Buffer(mcrypt.decrypt(cipher, iv, key, 'rijndael-128', 'cbc'));
      clearText.toString().should.equal(expectedText);
    });
  });
});
