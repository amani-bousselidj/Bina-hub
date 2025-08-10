// jest.setup.js
require('@testing-library/jest-dom');

// Polyfill TextEncoder/TextDecoder for libs expecting Node globals
const { TextEncoder, TextDecoder } = require('util');
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// If needed, tests can add their own fetch polyfill; we avoid requiring optional deps here.

global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};