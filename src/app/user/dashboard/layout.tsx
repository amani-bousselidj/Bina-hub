"use client";

import React from 'react';

export const dynamic = 'force-dynamic';

// Pass-through layout to avoid nested user-specific layout. The parent /user/layout.tsx wraps pages.
export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
