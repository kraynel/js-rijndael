/*
*  Modified from jsmcrypt version 0.1  -  Copyright 2012 F. Doering
*
*  This program is free software; you can redistribute it and/or
*  modify it under the terms of the GNU General Public License as
*  published by the Free Software Foundation; either version 2 of the
*  License, or (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
*  General Public License for more details.
*
*  You should have received a copy of the GNU General Public License
*  along with this program; if not, write to the Free Software
*  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
*  02111-1307 USA
*/
var rijndael = require('./rijndael');

var ciphers = {
  'rijndael-128': {blockSize: 16, keySize: 32},
  'rijndael-192': {blockSize: 24, keySize: 32},
  'rijndael-256': {blockSize: 32, keySize: 32}
};

var rijndaelCipher = function(block, key, encrypt) {
  if(encrypt) {
    rijndael.encrypt(block, key);
  } else {
    rijndael.decrypt(block, key);
  }
  return block;
};

var getBlockSize = function(cipher) {
  if(!ciphers[cipher]) {
    return false;
  }
  return ciphers[cipher].blockSize;
};

var getKeySize = function(cipher) {
  if(!ciphers[cipher]) {
    return false;
  }
  return ciphers[cipher].keySize;
};

var crypt = function(encrypt, text, IV, key, cipher, mode) {
  if(!text) return true;

  var blockS = ciphers[cipher].blockSize;
  var chunkS = blockS;
  var iv = [];

  switch(mode) {
    case 'cfb':
      chunkS = 1;
    case 'cbc':
    case 'ncfb':
    case 'nofb':
    case 'ctr':
      if(!IV) {
        throw 'JS-Rijndael crypt: IV is required for mode ' + mode;
      }

      if(IV.length != blockS) {
        throw 'JS-Rijndael crypt: IV must be ' + blockS + ' bytes long for ' + cipher;
      }

      iv = IV.slice();
      break;
    case 'ecb':
      break;
    default:
      throw 'JS-Rijndael crypt: Unsupported mode of operation ' + cMode;
  }

  var chunks = Math.ceil(text.length/chunkS);
  var orig = text.length;

  while(text.length < chunks*chunkS) {
    text.push(0);
  }

  var out = [];
  switch(mode) {
    case 'ecb':
    for(var i = 0; i < chunks; i++) {
      for(var j = 0; j < chunkS; j++) {
        iv[j] = text[(i*chunkS)+j];
      }
      rijndaelCipher(iv, key, encrypt);
      for(var j = 0; j < chunkS; j++) {
        out.push(iv[j]);
      }

      var last;
      do {
        last = out.pop();
      } while(last == 0)
      out.push(last);

    }
    break;
    case 'cbc':
    if(encrypt) {
      for(var i = 0; i < chunks; i++) {
        for(var j = 0; j < chunkS; j++) {
          iv[j] = text[(i*chunkS)+j]^iv[j];
        }

        rijndaelCipher(iv, key, true);
        for(var j = 0; j < chunkS; j++) {
          out.push(iv[j]);
        }
      }
    } else {
      for(var i = 0; i < chunks; i++) {
        var temp = iv;
        iv = new Array(chunkS);
        for(var j = 0; j < chunkS; j++) {
          iv[j] = text[(i*chunkS)+j];
        }
        var decr = iv.slice(0);
        rijndaelCipher(decr, key, false);
        for(var j = 0; j < chunkS; j++) {
          out.push(temp[j]^decr[j]);
        }
      }
      var last;
      do {
        last = out.pop();
      } while(last == 0)
      out.push(last);
    }
    break;
    case 'cfb':
    for(var i = 0; i < chunks; i++) {
      var temp = iv.slice(0);
      rijndaelCipher(temp, key, true);
      temp = temp[0]^text[i];
      iv.push(encrypt?temp:text[i]);
      iv.shift();
      out.push(temp);
    }
    out = out.splice(0, orig);
    break;
    case 'ncfb':
    for(var i = 0; i < chunks; i++) {
      rijndaelCipher(iv, key, true);
      for(var j = 0; j < chunkS; j++) {
        var temp = text[(i*chunkS)+j];
        iv[j] = temp^iv[j];
        out.push(iv[j]);
        if(!encrypt) {
          iv[j] = temp;
        }
      }
    }
    out = out.splice(0, orig);
    break;
    case 'nofb':
    for(var i = 0; i < chunks; i++) {
      rijndaelCipher(iv, key, true);
      for(var j = 0; j < chunkS; j++) {
        out.push(text[(i*chunkS)+j]^iv[j]);
      }
    }
    out = out.slice(0, orig);
    break;
    case 'ctr':
    for(var i = 0; i < chunks; i++) {
      temp = iv.slice(0);
      rijndaelCipher(temp, key, true);
      for(var j = 0; j < chunkS; j++) {
        out.push(text[(i*chunkS)+j]^temp[j]);
      }
      var carry = 1;
      var index = chunkS;
      do {
        index--;
        iv[index]++;
        carry = iv[index] >> 8;
        iv[index] &= 255;
      } while(carry)
    }
    out = out.slice(0, orig);
    break;
  }

  return out;
};

module.exports = {
  encrypt: function(message, IV, key, cipher, mode) {
    return crypt(true, message, IV, key, cipher, mode);
  },
  decrypt: function(ctext, IV, key, cipher, mode) {
    return crypt(false, ctext, IV, key, cipher, mode);
  },
  getBlockSize: getBlockSize,
  getIVSize: getBlockSize,
  getKeySize: getKeySize,
  listAlgorithms: function() {
    return Object.keys(ciphers);
  },
  listModes: function() {
    return ['ecb', 'cbc', 'cfb', 'ncfb', 'nofb', 'ctr'];
  }
}
