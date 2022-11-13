import test from 'node:test';
import assert from 'node:assert/strict';

test('a passing test', () => {
  assert(true);
});

test('deepEqual failure', {skip: 1}, () => {
  assert.deepEqual(['test and', 'fail'], ['test and', 'succeed']);
});
