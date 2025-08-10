'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  PieChart
} from 'lucide-react';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  status: 'under' | 'on-track' | 'over' | 'exceeded';
}

interface BudgetSummary {
  totalBudget: number;
  totalActual: number;
  totalVariance: number;
  utilizationRate: number;
}

export default function BudgetManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: '1',
      category: 'Materials',
      description: 'Cement, steel, bricks',
      budgetAmount: 150000,
      actualAmount: 142000,
      variance: -8000,
      status: 'under'
    },
    {
      id: '2',
      category: 'Labor',
      description: 'Construction workers',
      budgetAmount: 80000,
      actualAmount: 85000,
      variance: 5000,
      status: 'over'
    },
    {
      id: '3',
      category: 'Equipment',
      description: 'Machinery rental',
      budgetAmount: 45000,
      actualAmount: 43000,
      variance: -2000,
      status: 'under'
    },
    {
      id: '4',
      category: 'Permits',
      description: 'Government permits',
      budgetAmount: 25000,
      actualAmount: 28000,
      variance: 3000,
      status: 'over'
    }
  ]);

  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    budgetAmount: '',
    actualAmount: ''
  });

  const budgetSummary: BudgetSummary = {
    totalBudget: budgetItems.reduce((sum, item) => sum + item.budgetAmount, 0),
    totalActual: budgetItems.reduce((sum, item) => sum + item.actualAmount, 0),
    totalVariance: budgetItems.reduce((sum, item) => sum + item.variance, 0),
    utilizationRate: 0
  };

  budgetSummary.utilizationRate = (budgetSummary.totalActual / budgetSummary.totalBudget) * 100;

  const handleAddItem = () => {
    if (newItem.category && newItem.description && newItem.budgetAmount) {
      const budget = parseFloat(newItem.budgetAmount);
      const actual = parseFloat(newItem.actualAmount) || 0;
      const variance = actual - budget;
      
      let status: BudgetItem['status'] = 'on-track';
      if (actual < budget * 0.9) status = 'under';
      else if (actual > budget * 1.1) status = 'exceeded';
      else if (actual > budget) status = 'over';

      const item: BudgetItem = {
        id: Date.now().toString(),
        category: newItem.category,
        description: newItem.description,
        budgetAmount: budget,
        actualAmount: actual,
        variance,
        status
      };

      setBudgetItems([...budgetItems, item]);
      setNewItem({ category: '', description: '', budgetAmount: '', actualAmount: '' });
    }
  };

  const getStatusColor = (status: BudgetItem['status']) => {
    switch (status) {
      case 'under': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'over': return 'bg-yellow-100 text-yellow-800';
      case 'exceeded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: BudgetItem['status']) => {
    switch (status) {
      case 'under': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'on-track': return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'over': return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case 'exceeded': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Budget Management</h1>
        <p className="text-gray-600">Track and control project costs with real-time monitoring</p>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-blue-600">
                  {budgetSummary.totalBudget.toLocaleString('en-US')} SAR
                </p>
              </div>
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actual Spent</p>
                <p className="text-2xl font-bold text-green-600">
                  {budgetSummary.totalActual.toLocaleString('en-US')} SAR
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Variance</p>
                <p className={`text-2xl font-bold ${budgetSummary.totalVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {budgetSummary.totalVariance > 0 ? '+' : ''}{budgetSummary.totalVariance.toLocaleString('en-US')} SAR
                </p>
              </div>
              {budgetSummary.totalVariance < 0 ? 
                <TrendingDown className="w-8 h-8 text-green-600" /> : 
                <TrendingUp className="w-8 h-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-purple-600">
                  {budgetSummary.utilizationRate.toFixed(1)}%
                </p>
              </div>
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="add-item">Add Item</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">
                    {budgetSummary.totalActual.toLocaleString('en-US')} / {budgetSummary.totalBudget.toLocaleString('en-US')} SAR
                  </span>
                </div>
                <Progress value={budgetSummary.utilizationRate} className="w-full" />
                <p className="text-xs text-gray-500">
                  {budgetSummary.utilizationRate < 90 ? 'Budget utilization is on track' : 
                   budgetSummary.utilizationRate < 100 ? 'Approaching budget limit' : 
                   'Budget exceeded - review required'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <h4 className="font-medium">{item.category}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.actualAmount.toLocaleString('en-US')} SAR</p>
                        <p className="text-xs text-gray-500">of {item.budgetAmount.toLocaleString('en-US')} SAR</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetItems.map((item) => {
                  const utilization = (item.actualAmount / item.budgetAmount) * 100;
                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm text-gray-600">
                          {utilization.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={utilization} className="w-full" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{item.actualAmount.toLocaleString('en-US')} SAR</span>
                        <span>{item.budgetAmount.toLocaleString('en-US')} SAR</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-item" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Budget Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    placeholder="e.g., Materials, Labor"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Brief description"
                  />
                </div>
                <div>
                  <Label htmlFor="budgetAmount">Budget Amount (SAR)</Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    value={newItem.budgetAmount}
                    onChange={(e) => setNewItem({...newItem, budgetAmount: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="actualAmount">Actual Amount (SAR)</Label>
                  <Input
                    id="actualAmount"
                    type="number"
                    value={newItem.actualAmount}
                    onChange={(e) => setNewItem({...newItem, actualAmount: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Budget Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}





