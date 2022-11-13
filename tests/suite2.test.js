import test from 'node:test';
import assert from 'node:assert/strict';

test('a skipped test', t => {
  return t.skip();
  assert.equal('you wish', 'passing through');
});

test('a todo test', {todo: 1}, () => {
  assert.equal({}, {a:5});
});
