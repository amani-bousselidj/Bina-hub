'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Loader2, Shield, Users, Settings, Eye, EyeOff, Lock } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'inventory' | 'orders' | 'customers' | 'reports' | 'settings' | 'staff';
  level: 'read' | 'write' | 'admin';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  userCount: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  storeAccess: string[];
}

const StorePermissionSystem: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'roles' | 'users' | 'permissions'>('roles');

  useEffect(() => {
    fetchData().catch(error => {
      console.error('Error in StorePermissionSystem fetchData:', error);
      setLoading(false);
    });
  }, []);

  const fetchData = async () => {
    try {
      // Mock permissions
      const mockPermissions: Permission[] = [
        {
          id: 'inv_read',
          name: 'View Inventory',
          description: 'View inventory items and stock levels',
          category: 'inventory',
          level: 'read'
        },
        {
          id: 'inv_write',
          name: 'Manage Inventory',
          description: 'Add, edit, and delete inventory items',
          category: 'inventory',
          level: 'write'
        },
        {
          id: 'ord_read',
          name: 'View Orders',
          description: 'View customer orders and order history',
          category: 'orders',
          level: 'read'
        },
        {
          id: 'ord_write',
          name: 'Manage Orders',
          description: 'Process, update, and manage orders',
          category: 'orders',
          level: 'write'
        },
        {
          id: 'cust_read',
          name: 'View Customers',
          description: 'View customer information and profiles',
          category: 'customers',
          level: 'read'
        },
        {
          id: 'cust_write',
          name: 'Manage Customers',
          description: 'Add, edit, and manage customer accounts',
          category: 'customers',
          level: 'write'
        },
        {
          id: 'rep_read',
          name: 'View Reports',
          description: 'Access sales and business reports',
          category: 'reports',
          level: 'read'
        },
        {
          id: 'set_admin',
          name: 'System Settings',
          description: 'Configure system settings and integrations',
          category: 'settings',
          level: 'admin'
        }
      ];

      // Mock roles
      const mockRoles: Role[] = [
        {
          id: 'admin',
          name: 'Store Administrator',
          description: 'Full access to all store functions',
          permissions: mockPermissions.map(p => p.id),
          isDefault: false,
          userCount: 2
        },
        {
          id: 'manager',
          name: 'Store Manager',
          description: 'Manage inventory, orders, and customers',
          permissions: ['inv_read', 'inv_write', 'ord_read', 'ord_write', 'cust_read', 'cust_write', 'rep_read'],
          isDefault: false,
          userCount: 5
        },
        {
          id: 'cashier',
          name: 'Cashier',
          description: 'Process orders and basic customer management',
          permissions: ['inv_read', 'ord_read', 'ord_write', 'cust_read'],
          isDefault: true,
          userCount: 12
        },
        {
          id: 'viewer',
          name: 'Read Only',
          description: 'View-only access to store data',
          permissions: ['inv_read', 'ord_read', 'cust_read', 'rep_read'],
          isDefault: false,
          userCount: 3
        }
      ];

      // Real users matching our authentication system
      const mockUsers: User[] = [
        {
          id: 'real-store-001',
          email: 'store@binaa.com',
          name: 'أحمد التجاري',
          role: 'admin',
          status: 'active',
          lastLogin: new Date().toISOString(),
          storeAccess: ['store-binaa-001']
        },
        {
          id: 'real-user-001',
          email: 'user@binaa.com',
          name: 'محمد العبدالله',
          role: 'viewer',
          status: 'active',
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          storeAccess: ['store-binaa-001']
        },
        {
          id: 'admin-001',
          email: 'admin@binaa.com',
          name: 'مدير النظام',
          role: 'admin',
          status: 'active',
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          storeAccess: ['store-binaa-001']
        }
      ];

      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getPermissionColor = (level: Permission['level']) => {
    switch (level) {
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'write':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Permission['category']) => {
    switch (category) {
      case 'inventory':
        return '📦';
      case 'orders':
        return '🛒';
      case 'customers':
        return '👥';
      case 'reports':
        return '📊';
      case 'settings':
        return '⚙️';
      case 'staff':
        return '👤';
      default:
        return '🔧';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Permission System</h1>
        <Button onClick={() => alert('Button clicked')}>
          <Users className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'roles', label: 'Roles', icon: Shield },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'permissions', label: 'Permissions', icon: Lock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Roles Tab */}
      {selectedTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  {role.isDefault && (
                    <Badge variant="outline">Default</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Users assigned:</span>
                    <Badge variant="secondary">{role.userCount}</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permId) => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <Badge 
                            key={permId} 
                            className={getPermissionColor(perm.level)}
                            variant="secondary"
                          >
                            {perm.name}
                          </Badge>
                        ) : null;
                      })}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                      <Eye className="h-3 w-3 mr-1" />
                      View Users
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Store Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        Role: {roles.find(r => r.id === user.role)?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      {user.lastLogin && (
                        <div className="text-xs text-gray-500 mt-1">
                          Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => alert('Button clicked')}>
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.status === 'active' ? 'destructive' : 'default'}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions Tab */}
      {selectedTab === 'permissions' && (
        <div className="space-y-6">
          {Object.entries(
            permissions.reduce((acc, perm) => {
              if (!acc[perm.category]) acc[perm.category] = [];
              acc[perm.category].push(perm);
              return acc;
            }, {} as Record<string, Permission[]>)
          ).map(([category, perms]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">{getCategoryIcon(category as Permission['category'])}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {perms.map((permission) => (
                    <div key={permission.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{permission.name}</div>
                        <Badge className={getPermissionColor(permission.level)}>
                          {permission.level}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {permission.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePermissionSystem;


