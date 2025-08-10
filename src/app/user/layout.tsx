import React from 'react';
import UserLayoutShell from '@/domains/user/components/layout';

export const dynamic = 'force-dynamic';

export default function UserAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap all /user/* routes with the unified user layout shell
  return <UserLayoutShell>{children}</UserLayoutShell>;
}
