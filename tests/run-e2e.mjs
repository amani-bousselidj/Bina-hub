#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const which = process.argv[2] || 'all';

/**
 * Runs Puppeteer e2e suites using ts-node/register for TS support.
 * We keep tests in tests/e2e/*.spec.ts
 */
const jestBin = 'node_modules/.bin/jest';
const patterns = which === 'smoke' ? ['tests/e2e/smoke-clicks.spec.ts'] : ['tests/e2e'];

const child = spawn(process.execPath, [jestBin, '-c', 'jest.config.cjs', ...patterns], {
  stdio: 'inherit',
  env: { ...process.env, JEST_JASMINE_TIMEOUT: '30000' }
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
