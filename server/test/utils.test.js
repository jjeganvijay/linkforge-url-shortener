const test = require('node:test');
const assert = require('node:assert/strict');

test('normalizeUrl adds https scheme when missing', async () => {
  const { normalizeUrl } = require('../src/utils/generateShortCode');
  assert.equal(normalizeUrl('example.com'), 'https://example.com');
  assert.equal(normalizeUrl('  example.com/path  '), 'https://example.com/path');
});

test('isValidUrl accepts http/https and rejects other schemes', async () => {
  const { isValidUrl } = require('../src/utils/generateShortCode');
  assert.equal(isValidUrl('https://example.com'), true);
  assert.equal(isValidUrl('http://example.com'), true);
  assert.equal(isValidUrl('ftp://example.com'), false);
  assert.equal(isValidUrl('not a url'), false);
});

test('generateShortCode returns requested length', async () => {
  const { generateShortCode } = require('../src/utils/generateShortCode');
  const code = generateShortCode(10);
  assert.equal(code.length, 10);
});

test('AES encrypt/decrypt roundtrip', async () => {
  process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const { encrypt, decrypt } = require('../src/utils/encrypt');

  const input = 'https://example.com/some/path?x=1';
  const out = encrypt(input);
  assert.ok(out.encryptedUrl);
  assert.ok(out.urlIv);
  assert.ok(out.urlAuthTag);
  assert.equal(decrypt(out.encryptedUrl, out.urlIv, out.urlAuthTag), input);
});

