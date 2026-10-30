

import test from 'node:test';
import assert from 'node:assert/strict';
import { add, multiply } from '../src/calculator.mjs';

test('adds two numbers correctly', () => {
  assert.equal(add(2, 3), 5);
});

test('multiplies two numbers correctly', () => {
  assert.equal(multiply(4, 3), 12);
});

test('multiplication by zero returns zero', () => {
  assert.equal(multiply(5, 0), 0);
});

