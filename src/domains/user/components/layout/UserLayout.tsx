// @ts-nocheck
import React from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="user-layout">
      {/* User dashboard navigation, header, etc. */}
      {children}
    </div>
  );
}





