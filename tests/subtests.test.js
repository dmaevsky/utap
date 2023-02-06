import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('suite description', () => {
  it('subtest foo', () => {
    assert(true);
  });
  it('subtest bar', { skip: 1 }, () => {
    assert(false);
  });
});
