var base64 = require('base64-js');
var mcrypt = require('./mcrypt');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var should = require('chai').should();
var testData = require('./test-data');

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
    var expectedText = testData.plaintext;

    testData.encoded.forEach(function(cipher) {
      it('should give the exact same result as libmcrypt, ' + cipher.cipher + ' ' + cipher.mode, function () {
        var key = [].slice.call(base64.toByteArray(cipher.key));
        var iv = [].slice.call(base64.toByteArray(cipher.iv));
        var message = [].slice.call(base64.toByteArray(cipher.message));
        var clearText = String.fromCharCode.apply(this, mcrypt.decrypt(message, iv, key, cipher.cipher, cipher.mode));
        clearText.toString().should.equal(expectedText);
      });
    });
  });
});
