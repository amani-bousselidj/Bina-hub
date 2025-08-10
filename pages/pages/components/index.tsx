// @ts-nocheck
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="landing-page">
      <h1>Welcome to the Platform</h1>
      <p>Free construction calculator, projects for sale, products, and dashboards for users and stores.</p>
      <div style={{ marginTop: 24 }}>
        <Link href="/user/login">User Login</Link> |{' '}
        <Link href="/store/login">Store Login</Link>
      </div>
      {/* Add more info, tools, and features here */}
    </div>
  );
}




