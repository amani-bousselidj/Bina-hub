// @ts-nocheck
// src/global.d.ts
// This file augments the Window interface to include the Google Maps API

export {};

declare global {
  interface Window {
    google: any;
  }
  
  // Jest types
  var describe: jest.Describe;
  var test: jest.It;
  var it: jest.It;
  var expect: jest.Expect;
  var beforeEach: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
  var beforeAll: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var jest: typeof import('jest');
}




