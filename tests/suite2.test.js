import test from 'node:test';
import assert from 'node:assert/strict';

test('another passing test', () => {
  assert(true);
});

test('equal failure', {skip: 1}, () => {
  assert.equal({}, {a:5});
});
