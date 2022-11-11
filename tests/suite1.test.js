import test from 'node:test';
import assert from 'node:assert/strict';

test('a passing test', () => {
  assert(true);
});

test('deepEqual failure', {todo: 1}, () => {
  assert.deepEqual([1,2], [1,5]);
});
