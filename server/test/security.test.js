const test = require('node:test');
const assert = require('node:assert/strict');

test('originCheck allows safe methods', async () => {
  const originCheck = require('../src/middleware/originCheck');

  let nextCalled = false;
  originCheck(
    { method: 'GET', headers: { origin: 'https://evil.example' } },
    {},
    () => {
      nextCalled = true;
    }
  );
  assert.equal(nextCalled, true);
});

test('originCheck blocks unknown origins for unsafe methods', async () => {
  process.env.FRONTEND_URL = 'http://localhost:5173';
  delete require.cache[require.resolve('../src/config/env')];
  const originCheck = require('../src/middleware/originCheck');

  let statusCode = null;
  let body = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  originCheck(
    { method: 'POST', headers: { origin: 'https://evil.example' } },
    res,
    () => {}
  );

  assert.equal(statusCode, 403);
  assert.equal(body?.success, false);
});

test('csrfProtection skips when no auth cookie token present', async () => {
  const { csrfProtection } = require('../src/middleware/csrf');

  let nextCalled = false;
  csrfProtection(
    { method: 'POST', cookies: {} },
    {},
    () => {
      nextCalled = true;
    }
  );
  assert.equal(nextCalled, true);
});

test('csrfProtection blocks when cookie/header mismatch', async () => {
  const { csrfProtection } = require('../src/middleware/csrf');

  let statusCode = null;
  let body = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  csrfProtection(
    {
      method: 'POST',
      cookies: { token: 'jwt', csrfToken: 'a' },
      get(name) {
        if (String(name).toLowerCase() === 'x-csrf-token') return 'b';
        return undefined;
      },
    },
    res,
    () => {}
  );

  assert.equal(statusCode, 403);
  assert.equal(body?.success, false);
});

