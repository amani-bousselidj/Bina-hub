// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Textarea } from '@/components/ui';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'inventory' | 'pos' | 'orders' | 'reports' | 'settings' | 'users';
  level: 'read' | 'write' | 'admin';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  isSystem: boolean;
}

interface StoreUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

const predefinedPermissions: Permission[] = [
  // Inventory Permissions
  { id: 'inventory_view', name: 'View Inventory', description: 'View product stock and inventory levels', category: 'inventory', level: 'read' },
  { id: 'inventory_edit', name: 'Edit Inventory', description: 'Add, edit, and update inventory items', category: 'inventory', level: 'write' },
  { id: 'inventory_delete', name: 'Delete Inventory', description: 'Remove products from inventory', category: 'inventory', level: 'admin' },
  { id: 'inventory_transfer', name: 'Transfer Stock', description: 'Transfer stock between locations', category: 'inventory', level: 'write' },
  
  // POS Permissions
  { id: 'pos_access', name: 'Access POS', description: 'Use the point of sale system', category: 'pos', level: 'read' },
  { id: 'pos_sales', name: 'Process Sales', description: 'Create and complete sales transactions', category: 'pos', level: 'write' },
  { id: 'pos_refunds', name: 'Process Refunds', description: 'Issue refunds and returns', category: 'pos', level: 'write' },
  { id: 'pos_discounts', name: 'Apply Discounts', description: 'Apply discounts to sales', category: 'pos', level: 'write' },
  { id: 'pos_void', name: 'Void Transactions', description: 'Void and cancel transactions', category: 'pos', level: 'admin' },
  
  // Orders Permissions
  { id: 'orders_view', name: 'View Orders', description: 'View customer orders and details', category: 'orders', level: 'read' },
  { id: 'orders_edit', name: 'Edit Orders', description: 'Modify order details and status', category: 'orders', level: 'write' },
  { id: 'orders_fulfill', name: 'Fulfill Orders', description: 'Mark orders as fulfilled and shipped', category: 'orders', level: 'write' },
  { id: 'orders_cancel', name: 'Cancel Orders', description: 'Cancel customer orders', category: 'orders', level: 'admin' },
  
  // Reports Permissions
  { id: 'reports_view', name: 'View Reports', description: 'Access sales and business reports', category: 'reports', level: 'read' },
  { id: 'reports_export', name: 'Export Reports', description: 'Export reports and data', category: 'reports', level: 'write' },
  { id: 'reports_financial', name: 'Financial Reports', description: 'Access financial and revenue reports', category: 'reports', level: 'admin' },
  
  // Settings Permissions
  { id: 'settings_view', name: 'View Settings', description: 'View store configuration settings', category: 'settings', level: 'read' },
  { id: 'settings_edit', name: 'Edit Settings', description: 'Modify store settings and configuration', category: 'settings', level: 'write' },
  { id: 'settings_payment', name: 'Payment Settings', description: 'Configure payment methods and settings', category: 'settings', level: 'admin' },
  
  // User Management Permissions
  { id: 'users_view', name: 'View Users', description: 'View store staff and user information', category: 'users', level: 'read' },
  { id: 'users_invite', name: 'Invite Users', description: 'Send invitations to new staff members', category: 'users', level: 'write' },
  { id: 'users_manage', name: 'Manage Users', description: 'Edit user roles and permissions', category: 'users', level: 'admin' },
  { id: 'users_delete', name: 'Remove Users', description: 'Remove users from the store', category: 'users', level: 'admin' },
];

const defaultRoles: Role[] = [
  {
    id: 'owner',
    name: 'Store Owner',
    description: 'Full access to all store features and settings',
    permissions: predefinedPermissions.map(p => p.id),
    color: 'bg-purple-100 text-purple-800',
    isSystem: true
  },
  {
    id: 'manager',
    name: 'Store Manager',
    description: 'Manage daily operations, sales, and inventory',
    permissions: [
      'inventory_view', 'inventory_edit', 'inventory_transfer',
      'pos_access', 'pos_sales', 'pos_refunds', 'pos_discounts',
      'orders_view', 'orders_edit', 'orders_fulfill',
      'reports_view', 'reports_export',
      'settings_view', 'users_view'
    ],
    color: 'bg-blue-100 text-blue-800',
    isSystem: true
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Process sales and handle customer transactions',
    permissions: [
      'inventory_view',
      'pos_access', 'pos_sales', 'pos_refunds',
      'orders_view'
    ],
    color: 'bg-green-100 text-green-800',
    isSystem: true
  },
  {
    id: 'inventory_clerk',
    name: 'Inventory Clerk',
    description: 'Manage inventory and stock levels',
    permissions: [
      'inventory_view', 'inventory_edit', 'inventory_transfer',
      'orders_view', 'orders_fulfill',
      'reports_view'
    ],
    color: 'bg-yellow-100 text-yellow-800',
    isSystem: true
  }
];

const mockUsers: StoreUser[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@store.com',
    phone: '+966501234567',
    role: 'owner',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-01-06T10:30:00'
  },
  {
    id: '2',
    name: 'Fatima Hassan',
    email: 'fatima@store.com',
    phone: '+966509876543',
    role: 'manager',
    status: 'active',
    joinDate: '2024-02-01',
    lastActive: '2024-01-06T09:15:00'
  },
  {
    id: '3',
    name: 'Mohammed Abdullah',
    email: 'mohammed@store.com',
    phone: '+966507654321',
    role: 'cashier',
    status: 'active',
    joinDate: '2024-03-10',
    lastActive: '2024-01-05T16:45:00'
  },
  {
    id: '4',
    name: 'Sara Al-Zahrani',
    email: 'sara@store.com',
    phone: '+966502468135',
    role: 'inventory_clerk',
    status: 'pending',
    joinDate: '2024-01-05',
    lastActive: 'Never'
  }
];

export default function StorePermissionSystem() {
  const [users, setUsers] = useState<StoreUser[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newInvite, setNewInvite] = useState({
    email: '',
    name: '',
    phone: '',
    role: '',
    message: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleInviteUser = () => {
    const newUser: StoreUser = {
      id: (users.length + 1).toString(),
      name: newInvite.name,
      email: newInvite.email,
      phone: newInvite.phone,
      role: newInvite.role,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Never'
    };

    setUsers([...users, newUser]);
    setNewInvite({ email: '', name: '', phone: '', role: '', message: '' });
    setIsInviteDialogOpen(false);
  };

  const handleCreateRole = (newRole: Omit<Role, 'id'>) => {
    const role: Role = {
      ...newRole,
      id: `custom_${Date.now()}`,
    };
    setRoles([...roles, role]);
    setIsRoleDialogOpen(false);
    setEditingRole(null);
  };

  const categoryColors = {
    inventory: 'bg-blue-50 border-blue-200',
    pos: 'bg-green-50 border-green-200',
    orders: 'bg-purple-50 border-purple-200',
    reports: 'bg-orange-50 border-orange-200',
    settings: 'bg-red-50 border-red-200',
    users: 'bg-indigo-50 border-indigo-200'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Permission System</h1>
        <p className="text-gray-600">Manage store staff, roles, and permissions</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Store Staff
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
                  <UserPlus className="h-4 w-4" />
                  Invite Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite New Staff Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your store team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newInvite.name}
                      onChange={(e) => setNewInvite({...newInvite, name: e.target.value})}
                      placeholder="أحمد محمد"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newInvite.email}
                      onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                      placeholder="ahmed@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newInvite.phone}
                      onChange={(e) => setNewInvite({...newInvite, phone: e.target.value})}
                      placeholder="+966501234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newInvite.role} onValueChange={(value) => setNewInvite({...newInvite, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.filter(role => role.id !== 'owner').map(role => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Welcome Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={newInvite.message}
                      onChange={(e) => setNewInvite({...newInvite, message: e.target.value})}
                      placeholder="Welcome to our team! We're excited to have you join us."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser} disabled={!newInvite.name || !newInvite.email || !newInvite.role}>
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Grid */}
          <div className="grid gap-4">
            {filteredUsers.map(user => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={roleInfo.color}>
                          {roleInfo.name}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Joined: {user.joinDate}</p>
                          <p className="text-xs text-gray-500">
                            Last active: {user.lastActive === 'Never' ? 'Never' : new Date(user.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
            <Button onClick={() => setIsRoleDialogOpen(true)}>
              Create Custom Role
            </Button>
          </div>

          <div className="grid gap-6">
            {roles.map(role => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <Badge className={role.color}>{role.name}</Badge>
                        {role.isSystem && <Badge variant="outline">System Role</Badge>}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{role.description}</p>
                    </div>
                    {!role.isSystem && (
                      <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                        Edit Role
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      predefinedPermissions.reduce((acc, permission) => {
                        if (!acc[permission.category]) acc[permission.category] = [];
                        acc[permission.category].push(permission);
                        return acc;
                      }, {} as Record<string, Permission[]>)
                    ).map(([category, permissions]) => (
                      <div key={category} className={`p-4 rounded-lg border ${categoryColors[category as keyof typeof categoryColors]}`}>
                        <h4 className="font-medium capitalize mb-3">{category} Permissions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {permissions.map(permission => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={role.permissions.includes(permission.id)}
                                readOnly
                                className="pointer-events-none"
                              />
                              <div>
                                <Label className="text-sm font-medium">{permission.name}</Label>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Activity Log</CardTitle>
              <p className="text-gray-600">Track permission changes and user activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Role permissions updated</p>
                    <p className="text-sm text-gray-600">Manager role permissions were modified by Ahmed Al-Rashid</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <UserPlus className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">New user invited</p>
                    <p className="text-sm text-gray-600">Sara Al-Zahrani was invited as Inventory Clerk</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Permission granted</p>
                    <p className="text-sm text-gray-600">Mohammed Abdullah granted POS refund permission</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}









