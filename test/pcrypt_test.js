"use strict";

var assert = require('assert');
var pcrypt = require('../helper/pcrypt');

suite('pcrypt#createSalt');

test('Verify salt length', function(done) {
	var expectedSize = 128;
	// According to Node.js documentation, using the hex encoding every byte
	// corresponds to 2 characters
	// https://nodejs.org/dist/latest-v5.x/docs/api/buffer.html#buffer_buffer
	var expectedLength = expectedSize * 2;
	pcrypt.createSalt(function(salt) {
		assert.equal(salt.length, expectedLength);
		done();
	});
});

suite('pcrypt#hashPassword');

test('Simple password and salt', function(done) {
	var password = 'password';
	var salt = 'salt';
	var correctHash = 'd4088eb65e37e2d920d061b411b209e109cae1c4f5de0c7139d71c' +
	'7fa8f3add3b476d64bab3bb660295d83b59f8800016cc8983882bbb7f176342027c8c68b' +
	'fb9116cd5b1aea655dc22a32446a1107280a0dedceee490185c14fe2839f9c430fe8b705' +
	'35907deb5c7ea6ada17bb9cbf68861cc7651268ead8bcd1766b85e244d63bb218e733ee8' +
	'9bf18b16f65d37550068d24789513ffdc06c948a479a5ebc9d410eea64700b438ed5a581' +
	'abe25ff06a04f8d7dac1d94b5cbd2b0f4e02d4c2bfe2902f796526e7a06bc1b3da170dc6' +
	'e80a933b8574760486120c6d4713d20d8c49422c190892719ea79e5d7b6f76b619e43ba4' +
	'1b307cba57fa4523821633e453';
	pcrypt.hashPassword(password, salt, function(hash) {
		assert.equal(hash, correctHash);
		done();
	});
});

test('Complex password and salt', function(done) {
	var password = 'c0MP15Xp@ss';
	var salt = 'fec51d94bc2d02e59d4350723daef25a822dcf5c245de35ff629fc55a51c8' +
	'83e00ab1c2469efeb21a4b95c5baa81e12c869b9b71f92c40bc9fa40c53c5568d20c6ee9' +
	'62f943e4c6da868fc6f3bdf324a158f064d9cd62bb15590db9dfe186e9f91351a6ca8df1' +
	'bbca0fb4bfd0a08d607142403b3112e1827e8e2e7fe8809c4fc';
	var correctHash = 'ee2699730367878a07526dec9b5cb578d574ffa89981fb95c398e9' +
	'66b1fd182e024eeac9ef4f18b3d8ed9263c48845e31a2ecc7f9e3097282b90930d4d611f' +
	'eafd06d71136239e424d47723cf6104d2fae914bebfa57addfe9e97595695297a7638e4a' +
	'a44a3267ad7a1de009a576b49ece0c167be76c4ad6a91610a17c772690b235ab5cef65a4' +
	'4c208576f8102e1cf068bf6ca89b49a371c586d5e1e1bc536f64edc107562d4d7dacbe45' +
	'bc42216ff33967e06b63abd9ab103dd5158d3d5d303e0a0bce6ceaf62ab8593c4c9b1f49' +
	'67c37379120ccedf73b84a0e007eb6416c5586e23d6112d11c1fddc2077ae8ae4a3e255e' +
	'11755a523a3d573671af05239c';
	pcrypt.hashPassword(password, salt, function(hash) {
		assert.equal(hash, correctHash);
		done();
	});
});

test('Invalid password', function(done) {
	var password = null;
	var salt = 'salt';
	var createHash = function() {
		pcrypt.hashPassword(password, salt, function(hash) { 
			assert.fail(hash, null, 'Did not throw error', '==');
			done(); 
		});
	};
	assert.throws(createHash, Error);
	done();
});

test('Invalid salt', function(done) {
	var password = 'password';
	var salt = null;
	var createHash = function() {
		pcrypt.hashPassword(password, salt, function(hash) { 
			assert.fail(hash, null, 'Did not throw error', '==');
			done(); 
		});
	};
	assert.throws(createHash, Error);
	done();
});