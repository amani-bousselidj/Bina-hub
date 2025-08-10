import React from 'react';
import Link from 'next/link';

const menu = [
  { href: '/', label: 'POS Register' },
  { href: '/history', label: 'Sales History' },
  { href: '/settings', label: 'Settings' },
  { href: '/users', label: 'User Management' },
];

const POSNavbar: React.FC = () => (
  <nav style={{ background: '#222', color: '#fff', padding: '12px 24px', display: 'flex', gap: 24 }}>
    <span style={{ fontWeight: 'bold', fontSize: 18 }}>Binna POS</span>
    {menu.map((item) => (
      <Link key={item.href} href={item.href} style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>
        {item.label}
      </Link>
    ))}
  </nav>
);

export default POSNavbar;


