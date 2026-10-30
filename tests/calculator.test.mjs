
import test from 'node:test';
import assert from 'node:assert/strict';
import { add } from '../src/calculator.mjs';

test('adds two numbers correctly', () => {
  assert.equal(add(2, 3), 5);
});
