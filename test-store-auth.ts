// Test script to verify store authentication is working
// Run this by logging in with store@binaa.com and checking the redirect

console.log('Store Authentication Test');
console.log('========================');
console.log('1. Login with: store@binaa.com');
console.log('2. Expected redirect: /store/dashboard');
console.log('3. Expected layout: Blue gradient header');
console.log('4. Should NOT redirect to: /user/dashboard');

// Test user data for store user
export const testStoreUser = {
  email: 'store@binaa.com',
  user_type: 'store',
  name: 'أحمد التجاري',
  role: 'admin'
};

// Middleware test function
export const testMiddlewareRedirect = (userType: string) => {
  switch (userType) {
    case 'store':
      return '/store/dashboard';
    case 'user':
      return '/user/dashboard';
    case 'service-provider':
      return '/service-provider/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/user/dashboard';
  }
};
