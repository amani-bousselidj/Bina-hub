// Script to check login flow and dashboard page existence
const fs = require('fs');
const path = require('path');

const dashboards = [
  'src/domains/user/components/dashboard/page.tsx',
  'src/domains/service-provider/components/service-provider/dashboard/page.tsx',
  'src/domains/store/dashboard/page.tsx',
  'src/domains/admin/dashboard/page.tsx',
];

const loginPage = 'src/domains/auth/login/page.tsx';

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(__dirname, '..', filePath));
}

console.log('--- Login Flow Check ---');
if (checkFileExists(loginPage)) {
  console.log('Login page exists:', loginPage);
} else {
  console.log('Login page missing:', loginPage);
}

dashboards.forEach((dashboard) => {
  if (checkFileExists(dashboard)) {
    console.log('Dashboard exists:', dashboard);
  } else {
    console.log('Dashboard missing:', dashboard);
  }
});

console.log('--- End of Check ---');
