# JS-Rijndael

[![CircleCI](https://circleci.com/gh/kraynel/js-rijndael.svg?style=svg)](https://circleci.com/gh/kraynel/js-rijndael)
[![Coverage Status](https://coveralls.io/repos/github/kraynel/js-rijndael/badge.svg?branch=master)](https://coveralls.io/github/kraynel/js-rijndael?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/js-rijndael/badge.svg)](https://snyk.io/test/npm/js-rijndael)

JS-Rijndael is a port of F. Doering and B. Poettering implementation of Rijndael algorithm.
It has no external dependencies and is fully compatible with [mcrypt](http://php.net/manual/fr/book.mcrypt.php).

## How to use

Add the dependency to your project: `npm install --save js-rijndael`.
Require it in your file.
```js
var mcrypt = require('js-rijndael');
```
`mcrypt.listAlgorithms()` lists the available ciphers:
- rijndael-128
- rijndael-196
- rijndael-256

`mcrypt.listModes()` lists the available modes:
- ecb
- cbc
- cfb
- ncfb
- nofb
- ctr

Two methods are exposed: `Encrypt` and `Decrypt`. They take byte arrays as inputs (regular arrays).

### Encrypt

```js
encryptedByteArray = mcrypt.Encrypt(clearMessage, iv, key, cipherName, mode);
```

### Decrypt

```js
clearByteArray = mcrypt.Decrypt(encryptedMessage, iv, key, cipherName, mode);
```

### Example

```js
var base64 = require('base64-js');

var key = [].slice.call(base64.toByteArray("IkhCeiVpeE44RUliVmJDL1FnVltWNVomJn44RSZ4UWU="));
var iv = [].slice.call(base64.toByteArray("5DeaRfj4iHhBluFfyGDbPA=="));
var message = [].slice.call(base64.toByteArray("8N6UX4G5c\/DCtELUOEE5jAdlkLvjBpFQGvo\/7fv3lrOfBUY\/Ze545d5k1C\/lA4zQ88rt52TB3Gz4egWJzerxZy41+sVSOrtLHrQR+Tv7NGfi+vSlZdmAsYVtHOHEPvImmkr+8k9hkKLlZELdY\/mq2t5INTqtmPwxufJB\/3LC+HPnnC0BGYxjvKIJ3jEBfzwcmOiyZG7iea\/BLIZwoH9lUzRe8cR+eVjlTig9NW\/tNMdkYBrxCXoK8XlNAXzjkgtq6c2Sd8keckHvEkYdSkie+ZaZvSwngCQgOKsiTs3jUJkedVnHM9VXLeUCocV17IldQxxghCK14hvLZ4WRCbtDHxMreCR3Rpwv11rWURpvmz0="));
var clearText = String.fromCharCode.apply(this, mcrypt.decrypt(message, iv, key, cipher.cipher, cipher.mode));

console.log(clearText);
```
## Tests
### Generate test data

Two solutions:

- With `php` and `mcrypt`, run `php generateTests.php > ../test-data.js`
- With `docker`, run `./generateTests.sh`

### Run tests
With the test data generated, run `npm test`.
