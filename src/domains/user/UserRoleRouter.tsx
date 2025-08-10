import { useAuth } from '@hooks/useAuth';
import { useState, useEffect } from 'react';
// Note: These dashboard components will be created as part of the optimization
// import { ProjectOwnerDashboard } from './owner/Dashboard';
// import { SupervisorDashboard } from './supervisor/Dashboard';
// import { WorkerDashboard } from './worker/Dashboard';

export const UserRoleRouter = () => {
  const { user } = useAuth();
  
  // Fetch user role from Supabase - no hardcoded values
  const userRole = user?.user_metadata?.role || 'guest';
  
  // Route to appropriate dashboard based on role
  switch (userRole) {
    case 'owner':
      return (
        <div className="owner-dashboard">
          <h1>Project Owner Dashboard</h1>
          <p>Project Owner dashboard coming soon...</p>
          {/* <ProjectOwnerDashboard /> */}
        </div>
      );
    case 'supervisor':
      return (
        <div className="supervisor-dashboard">
          <h1>Supervisor Dashboard</h1>
          <p>Supervisor dashboard coming soon...</p>
          {/* <SupervisorDashboard /> */}
        </div>
      );
    case 'worker':
      return (
        <div className="worker-dashboard">
          <h1>Worker Dashboard</h1>
          <p>Worker dashboard coming soon...</p>
          {/* <WorkerDashboard /> */}
        </div>
      );
    default:
      return (
        <div className="guest-view">
          <h1>Welcome to binaaHub</h1>
          <p>Please log in to access your personalized dashboard.</p>
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Log in here
          </a>
        </div>
      );
  }
};



