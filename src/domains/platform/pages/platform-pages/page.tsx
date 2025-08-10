'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/core/shared/utils';
import { 
  Book, 
  ExternalLink, 
  Home, 
  Users, 
  Store, 
  Shield, 
  Globe,
  FileText,
  Search,
  ChevronDown,
  Copy,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

// Base URLs
const LOCAL_BASE_URL = 'http://localhost:3000';
const VERCEL_BASE_URL = 'https://binaa-hub-shafi-projs-projects.vercel.app';

// Page evaluation status type
type PageStatus = 'working' | 'needFix' | 'delete' | 'duplicate' | 'merge' | null;

// Local storage key for evaluations
const EVALUATIONS_STORAGE_KEY = 'platform-pages-evaluations';

// Pages data organized by sections
const pagesSections = {
  core: {
    title: 'Core Platform Pages',
    emoji: '🏠',
    description: 'Main platform landing pages and core functionality.',
    pages: [
      { path: '/', name: 'Home Page', description: 'Platform landing page' },
      { path: '/features', name: 'Features Page', description: 'Platform features showcase' },
      { path: '/platform-pages', name: 'Platform Pages Directory', description: 'This comprehensive page directory and navigation hub' },
      { path: '/success', name: 'Success Page', description: 'Success confirmation page' }
    ]
  },
  auth: {
    title: 'Authentication Pages',
    emoji: '🔐',
    description: 'User authentication and account management pages.',
    pages: [
      { path: '/auth/login', name: 'Login', description: 'User login page' },
      { path: '/auth/signup', name: 'Signup', description: 'User registration page' },
      { path: '/auth/forgot-password', name: 'Forgot Password', description: 'Password recovery page' },
      { path: '/auth/reset-password-confirm', name: 'Reset Password', description: 'Password reset confirmation' },
      { path: '/login', name: 'Alternative Login', description: 'Alternative login entry point' },
      { path: '/register', name: 'Alternative Register', description: 'Alternative registration entry point' }
    ]
  },
  user: {
    title: 'User Portal Pages',
    emoji: '👤',
    description: 'Complete user portal with dashboard, projects, AI tools, warranties, social features, and comprehensive personal management.',
    pages: [
      { path: '/user/dashboard', name: 'User Dashboard', description: 'Main user dashboard with stats and overview' },
      { path: '/user/dashboard/construction-data', name: 'Construction Data Dashboard', description: 'Construction-specific data dashboard' },
      { path: '/user/dashboard/real', name: 'Real-Time Dashboard', description: 'Real-time dashboard with live data' },
      { path: '/user/profile', name: 'User Profile', description: 'User profile management and settings' },
      { path: '/user/settings', name: 'User Settings', description: 'Account settings and preferences' },
      { path: '/user/balance', name: 'Account Balance', description: 'Account balance and transactions' },
      { path: '/user/subscriptions', name: 'Subscriptions', description: 'Manage active subscriptions' },
      { path: '/user/documents', name: 'Documents', description: 'Personal document management' },
      { path: '/user/expenses', name: 'Expense Tracking', description: 'Personal expense tracking and management' },
      { path: '/user/invoices', name: 'Invoices', description: 'Invoice management and history' },
      { path: '/user/feedback', name: 'Feedback', description: 'Submit feedback and suggestions' },
      { path: '/user/favorites', name: 'Favorites', description: 'Saved items and favorites' },
      { path: '/user/cart', name: 'Shopping Cart', description: 'Shopping cart management' },
      { path: '/user/orders', name: 'Order History', description: 'Order history and tracking' },
      { path: '/user/stores-browse', name: 'Browse Stores', description: 'Browse and discover stores' },
      { path: '/user/payment/success', name: 'Payment Success', description: 'Payment success confirmation page' },
      { path: '/user/payment/error', name: 'Payment Error', description: 'Payment error handling page' },
      { path: '/user/projects', name: 'Projects Dashboard', description: 'Project management dashboard' },
      { path: '/user/projects/list', name: 'Projects List', description: 'List and manage all projects' },
      { path: '/user/projects/create', name: 'Create Project', description: 'Create new construction project' },
      { path: '/user/projects/create/construction', name: 'Create Construction Project', description: 'Construction-specific project creation' },
      { path: '/user/projects/create/enhanced', name: 'Enhanced Project Creation', description: 'Enhanced project creation with advanced options' },
      { path: '/user/projects/create', name: 'Create Project', description: 'Standard project creation' },
      { path: '/user/projects/calculator', name: 'Project Calculator', description: 'Project cost calculation tools' },
      { path: '/user/projects/notebook', name: 'Project Notebook', description: 'Project notes and documentation' },
      { path: '/user/projects/settings', name: 'Project Settings', description: 'Configure project settings' },
      { path: '/user/projects/suppliers', name: 'Project Suppliers', description: 'Manage project suppliers' },
      { path: '/user/projects-marketplace', name: 'Projects Marketplace', description: 'Browse and purchase completed projects' },
      { path: '/user/projects-marketplace/for-sale', name: 'Projects For Sale', description: 'Projects available for purchase' },
      { path: '/user/comprehensive-construction-calculator', name: 'Construction Calculator', description: 'Advanced construction cost calculator' },
      { path: '/user/individual-home-calculator', name: 'Home Calculator', description: 'Individual home construction calculator' },
      { path: '/user/company-bulk-optimizer', name: 'Company Bulk Optimizer', description: 'Bulk purchase optimization for companies' },
      { path: '/user/ai-hub', name: 'AI Hub', description: 'Central AI tools and services' },
      { path: '/user/ai-assistant', name: 'AI Assistant', description: 'Personal AI construction assistant' },
      { path: '/user/ai-smart-features-test', name: 'AI Smart Features Test', description: 'Test AI-powered smart features' },
      { path: '/user/smart-construction-advisor', name: 'Smart Construction Advisor', description: 'AI-powered construction advice' },
      { path: '/user/smart-insights', name: 'Smart Insights', description: 'AI-driven project insights and analytics' },
      { path: '/user/building-advice', name: 'Construction Advice', description: 'Construction tips and professional advice' },
      { path: '/user/warranty-expense-tracking', name: 'Warranty & Expense Tracking', description: 'Combined warranty and expense management' },
      { path: '/user/warranties', name: 'Warranty Management', description: 'Product warranty tracking and claims' },
      { path: '/user/warranties/new', name: 'Add New Warranty', description: 'Register new product warranty' },
      { path: '/user/warranties/tracking', name: 'Warranty Tracking', description: 'Track warranty status and claims' },
      { path: '/user/warranties/ai-extract', name: 'AI Warranty Extraction', description: 'AI-powered warranty information extraction' },
      { path: '/user/social-community', name: 'Social Community', description: 'Community features and social interactions' },
      { path: '/user/chat', name: 'Chat & Messaging', description: 'Real-time chat and messaging' },
      { path: '/user/gamification', name: 'Gamification', description: 'Achievements, points, and gamification features' },
      { path: '/user/support', name: 'Customer Support', description: 'Help and customer support' },
      { path: '/user/help-center', name: 'Help Center', description: 'Self-service help and documentation' },
      { path: '/user/help-center/articles/documents', name: 'Help Articles', description: 'Help articles and documentation' }
    ]
  },
  store: {
    title: 'Store Management Pages',
    emoji: '🏪',
    description: 'Comprehensive e-commerce store management with products, orders, customers, POS, inventory, analytics, and business operations.',
    pages: [
      { path: '/store', name: 'Store Home', description: 'Store management portal home' },
      { path: '/store/dashboard', name: 'Store Dashboard', description: 'Store management dashboard with key metrics' },
      { path: '/store/admin', name: 'Store Admin', description: 'Store administration and management tools' },
      { path: '/store/settings', name: 'Store Settings', description: 'Store configuration and preferences' },
      { path: '/store/products', name: 'Products Management', description: 'Product catalog management' },
      { path: '/store/products/create', name: 'Create Product', description: 'Create new product' },
      { path: '/store/products/import', name: 'Import Products', description: 'Bulk product import' },
      { path: '/store/products/export', name: 'Export Products', description: 'Product data export' },
      { path: '/store/product-variants', name: 'Product Variants', description: 'Product variants and options management' },
      { path: '/store/product-bundles', name: 'Product Bundles', description: 'Product bundling and package deals' },
      { path: '/store/product-bundles/create', name: 'Create Product Bundle', description: 'Create new product bundles' },
      { path: '/store/collections', name: 'Product Collections', description: 'Product collections and categorization' },
      { path: '/store/collections/create', name: 'Create Collection', description: 'Create new product collection' },
      { path: '/store/inventory', name: 'Inventory Management', description: 'Inventory tracking and management' },
      { path: '/store/inventory/barcode-generation', name: 'Barcode Generation', description: 'Generate barcodes for products' },
      { path: '/store/inventory/stock-adjustments', name: 'Stock Adjustments', description: 'Stock level adjustments and corrections' },
      { path: '/store/inventory/stock-take', name: 'Stock Take', description: 'Stock counting and verification' },
      { path: '/store/inventory/stock-transfers', name: 'Stock Transfers', description: 'Inter-warehouse stock transfers' },
      { path: '/store/orders', name: 'Order Management', description: 'Order processing and fulfillment' },
      { path: '/store/order-management', name: 'Advanced Order Management', description: 'Advanced order processing and management' },
      { path: '/store/sales-orders', name: 'Sales Orders', description: 'Sales order processing and management' },
      { path: '/store/purchase-orders', name: 'Purchase Orders', description: 'Purchase order management' },
      { path: '/store/customers', name: 'Customer Database', description: 'Customer management system' },
      { path: '/store/customers/create', name: 'Create Customer', description: 'Add new customer' },
      { path: '/store/customer-segmentation', name: 'Customer Segmentation', description: 'Customer segmentation and targeting' },
      { path: '/store/customer-groups', name: 'Customer Groups', description: 'Manage customer groups and categories' },
      { path: '/store/pos', name: 'POS System', description: 'Point of sale system' },
      { path: '/store/pos/offline', name: 'Offline POS', description: 'Offline-capable POS system' },
      { path: '/store/cash-registers', name: 'Cash Registers', description: 'Cash register management' },
      { path: '/store/barcode-scanner', name: 'Barcode Scanner', description: 'Barcode scanning functionality' },
      { path: '/store/cart', name: 'Cart Management', description: 'Shopping cart management' },
      { path: '/store/wishlist', name: 'Wishlist Management', description: 'Customer wishlist management' },
      { path: '/store/financial-management', name: 'Financial Management', description: 'Financial overview, revenue, and expense tracking' },
      { path: '/store/expenses', name: 'Expense Management', description: 'Store expense tracking' },
      { path: '/store/payments', name: 'Payment Management', description: 'Payment processing and management' },
      { path: '/store/accounting/bank-reconciliation', name: 'Bank Reconciliation', description: 'Bank statement reconciliation' },
      { path: '/store/accounting/manual-journals', name: 'Manual Journals', description: 'Manual journal entries and adjustments' },
      { path: '/store/accounting/vat-management', name: 'VAT Management', description: 'VAT calculation and management' },
      { path: '/store/promotions', name: 'Promotions & Discounts', description: 'Promotional campaigns, discounts, and offers' },
      { path: '/store/promotions/create', name: 'Create Promotion', description: 'Create new promotion' },
      { path: '/store/campaigns', name: 'Marketing Campaigns', description: 'Marketing campaign management' },
      { path: '/store/email-campaigns', name: 'Email Campaigns', description: 'Email marketing and campaigns' },
      { path: '/store/pricing', name: 'Pricing Management', description: 'Price management and strategies' },
      { path: '/store/pricing/create', name: 'Create Pricing Rule', description: 'Create new pricing rules' },
      { path: '/store/suppliers', name: 'Supplier Management', description: 'Supplier relationship and procurement management' },
      { path: '/store/warehouses', name: 'Warehouse Management', description: 'Warehouse operations and management' },
      { path: '/store/delivery', name: 'Delivery Management', description: 'Delivery and logistics management' },
      { path: '/store/shipping', name: 'Shipping Management', description: 'Shipping options and configuration' },
      { path: '/store/marketplace', name: 'Marketplace Integration', description: 'Marketplace listings and integration' },
      { path: '/store/marketplace-vendors', name: 'Marketplace Vendors', description: 'Vendor management for marketplace' },
      { path: '/store/storefront', name: 'Storefront Customization', description: 'Customize store appearance and layout' },
      { path: '/store/warranty-management', name: 'Warranty Management', description: 'Product warranty tracking' },
      { path: '/store/currency-region', name: 'Currency & Region', description: 'Multi-currency and regional settings' },
      { path: '/store/erp', name: 'ERP Integration', description: 'Enterprise resource planning integration' },
      { path: '/store/permissions', name: 'User Permissions', description: 'Staff permissions and role management' },
      { path: '/store/notifications', name: 'Notifications', description: 'Store notification management' },
      { path: '/store/search', name: 'Product Search', description: 'Product search and discovery features' },
      { path: '/store/reports', name: 'Reports', description: 'Detailed business reports and analytics' },
      { path: '/store/hr/attendance', name: 'HR - Attendance', description: 'Employee attendance tracking' },
      { path: '/store/hr/claims', name: 'HR - Claims', description: 'Employee claims and expense management' },
      { path: '/store/hr/leave-management', name: 'HR - Leave Management', description: 'Employee leave request management' },
      { path: '/store/hr/payroll', name: 'HR - Payroll', description: 'Employee payroll management' }
    ]
  },
  storefront: {
    title: 'Storefront Pages',
    emoji: '🛍️',
    description: 'Public-facing storefront pages for customers.',
    pages: [
      { path: '/storefront', name: 'Main Storefront', description: 'Main public storefront interface' },
      { path: '/storefront/[id]', name: 'Individual Store', description: 'Individual store pages (dynamic routing)' }
    ]
  },
  admin: {
    title: 'Admin Portal Pages',
    emoji: '👑',
    description: 'Complete platform administration with analytics, store management, financial oversight, and system settings.',
    pages: [
      { path: '/admin/dashboard', name: 'Admin Dashboard', description: 'Platform administration dashboard with comprehensive overview' },
      { path: '/admin/analytics', name: 'Platform Analytics', description: 'Comprehensive platform analytics and performance metrics' },
      { path: '/admin/ai-analytics', name: 'AI Analytics Dashboard', description: 'AI-powered analytics and insights' },
      { path: '/admin/stores', name: 'Store Management', description: 'Manage and monitor all stores on the platform' },
      { path: '/admin/finance', name: 'Finance & Commissions', description: 'Financial management and commission tracking' },
      { path: '/admin/construction', name: 'Construction Ecosystem', description: 'Advanced construction module administration' },
      { path: '/admin/gcc-markets', name: 'GCC Markets Management', description: 'Gulf Cooperation Council markets oversight' },
      { path: '/admin/settings', name: 'System Settings', description: 'Platform-wide settings and configuration' },
      { path: '/admin/global', name: 'Global Settings', description: 'Global platform settings and configurations' }
    ]
  },
  public: {
    title: 'Public Access Pages',
    emoji: '🌍',
    description: 'Public pages accessible without authentication including marketplace, forums, calculators, and information services.',
    pages: [
      { path: '/calculator', name: 'Public Calculator', description: 'Free construction cost calculator for public use' },
      { path: '/house-construction-calculator', name: 'House Construction Calculator', description: 'Specialized calculator for house construction costs' },
      { path: '/marketplace', name: 'Public Marketplace', description: 'Public marketplace browsing for construction services and products' },
      { path: '/construction-data', name: 'Public Construction Data', description: 'Public construction data, insights, and market information' },
      { path: '/material-prices', name: 'Material Prices', description: 'Current construction material prices and market trends' },
      { path: '/forum', name: 'Community Forum', description: 'Public community forum for construction discussions' },
      { path: '/projects', name: 'Public Projects Showcase', description: 'Public showcase of construction projects' },
      { path: '/projects-for-sale', name: 'Projects For Sale', description: 'Construction projects available for purchase' },
      { path: '/stores-browse', name: 'Browse Stores', description: 'Browse construction stores and suppliers directory' },
      { path: '/supervisors', name: 'Supervisors Directory', description: 'Construction supervisors and professionals directory' },
      { path: '/checkout', name: 'Public Checkout', description: 'Public checkout process for services and products' }
    ]
  },
  finance: {
    title: 'Finance System',
    emoji: '💰',
    description: 'Financial services including banking, insurance, and loans.',
    pages: [
      { path: '/banking', name: 'Banking Services', description: 'Banking services and integration' },
      { path: '/insurance', name: 'Insurance Services', description: 'Insurance services and management' },
      { path: '/loans', name: 'Loan Services', description: 'Loan services and applications' }
    ]
  },
  constructionJourney: {
    title: 'Construction Journey',
    emoji: '🚧',
    description: 'End-to-end construction process management from land purchase to completion.',
    pages: [
      { path: '/construction-journey/land-purchase', name: 'Land Purchase', description: 'Land purchase guidance and management' },
      { path: '/construction-journey/blueprint-approval', name: 'Blueprint Approval', description: 'Blueprint approval process management' },
      { path: '/construction-journey/excavation', name: 'Excavation', description: 'Excavation planning and management' },
      { path: '/construction-journey/fencing', name: 'Fencing', description: 'Fencing installation and management' },
      { path: '/construction-journey/execution', name: 'Execution', description: 'Construction execution and monitoring' },
      { path: '/construction-journey/contractor-selection', name: 'Contractor Selection', description: 'Contractor selection and management' },
      { path: '/construction-journey/insurance', name: 'Construction Insurance', description: 'Construction insurance management' },
      { path: '/construction-journey/waste-disposal', name: 'Waste Disposal', description: 'Construction waste disposal management' }
    ]
  },
  dashboard: {
    title: 'Dashboard System',
    emoji: '📊',
    description: 'Various dashboard interfaces for different user types and services.',
    pages: [
      { path: '/dashboard', name: 'Main Dashboard', description: 'Main platform dashboard' },
      { path: '/dashboard/bookings', name: 'Bookings Dashboard', description: 'Booking management dashboard' },
      { path: '/dashboard/concrete-supplier', name: 'Concrete Supplier Dashboard', description: 'Concrete supplier dashboard' },
      { path: '/dashboard/equipment-rental', name: 'Equipment Rental Dashboard', description: 'Equipment rental management dashboard' },
      { path: '/dashboard/service-provider', name: 'Service Provider Dashboard', description: 'Service provider dashboard' },
      { path: '/dashboard/waste-management', name: 'Waste Management Dashboard', description: 'Waste management dashboard' }
    ]
  },
  serviceProvider: {
    title: 'Service Provider System',
    emoji: '🔧',
    description: 'Service provider dashboards and management interfaces.',
    pages: [
      { path: '/service-provider/dashboard', name: 'Service Provider Main Dashboard', description: 'Main service provider dashboard' },
      { path: '/service-provider/dashboard/bookings', name: 'Service Provider Bookings', description: 'Service provider booking management' },
      { path: '/service-provider/dashboard/concrete-supply', name: 'Concrete Supply Management', description: 'Concrete supply management for service providers' }
    ]
  },
  system: {
    title: 'System Management',
    emoji: '🛠️',
    description: 'System administration, database management, and development tools.',
    pages: [
      { path: '/database-management', name: 'Database Management', description: 'Database administration and management' },
      { path: '/quick-test', name: 'Quick Test', description: 'Quick testing interface for development' },
      { path: '/test-login', name: 'Test Login', description: 'Login testing interface' },
      { path: '/test-supabase', name: 'Test Supabase', description: 'Supabase connection testing' }
    ]
  }
};

interface PageData {
  path: string;
  name: string;
  description: string;
}

interface PageLinkProps extends PageData {
  evaluations: Record<string, PageStatus>;
  updateEvaluation: (pagePath: string, status: PageStatus) => void;
}

function PageLink({ path, name, description, evaluations, updateEvaluation }: PageLinkProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (url: string, type: 'local' | 'vercel') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(`${path}-${type}`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback method for older browsers or when clipboard access is denied
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(`${path}-${type}`);
        setTimeout(() => setCopied(null), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case 'working':
        return 'border-green-300 bg-green-50';
      case 'needFix':
        return 'border-yellow-300 bg-yellow-50';
      case 'delete':
        return 'border-red-300 bg-red-50';
      case 'duplicate':
        return 'border-orange-300 bg-orange-50';
      case 'merge':
        return 'border-purple-300 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const localUrl = `${LOCAL_BASE_URL}${path}`;
  const vercelUrl = `${VERCEL_BASE_URL}${path}`;
  const currentStatus = evaluations[path];

  return (
    <div className={`rounded-lg p-4 border hover:border-blue-300 transition-colors ${getStatusColor(currentStatus)}`}>
      {/* Header with name and current status */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800 flex-1">{name}</h4>
        {currentStatus && (
          <div className="ml-2">
            {currentStatus === 'working' && <Check className="w-4 h-4 text-green-600" />}
            {currentStatus === 'needFix' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
            {currentStatus === 'delete' && <Trash2 className="w-4 h-4 text-red-600" />}
            {currentStatus === 'duplicate' && <Copy className="w-4 h-4 text-orange-600" />}
            {currentStatus === 'merge' && <FileText className="w-4 h-4 text-purple-600" />}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      {/* Evaluation Options */}
      <div className="mb-4 p-3 bg-white rounded border">
        <p className="text-xs font-medium text-gray-700 mb-2">تقييم الصفحة:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateEvaluation(path, currentStatus === 'working' ? null : 'working')}
            className="flex items-center gap-2 text-sm hover:bg-green-50 p-1 rounded"
            title="Mark as Working"
          >
            {currentStatus === 'working' ? 
              <CheckSquare className="w-4 h-4 text-green-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-green-700">يعمل</span>
          </button>
          
          <button
            onClick={() => updateEvaluation(path, currentStatus === 'needFix' ? null : 'needFix')}
            className="flex items-center gap-2 text-sm hover:bg-yellow-50 p-1 rounded"
            title="Mark as Need Fix"
          >
            {currentStatus === 'needFix' ? 
              <CheckSquare className="w-4 h-4 text-yellow-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-yellow-700">يحتاج إصلاح</span>
          </button>
          
          <button
            onClick={() => updateEvaluation(path, currentStatus === 'delete' ? null : 'delete')}
            className="flex items-center gap-2 text-sm hover:bg-red-50 p-1 rounded"
            title="Mark for Deletion"
          >
            {currentStatus === 'delete' ? 
              <CheckSquare className="w-4 h-4 text-red-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-red-700">حذف</span>
          </button>

          <button
            onClick={() => updateEvaluation(path, currentStatus === 'duplicate' ? null : 'duplicate')}
            className="flex items-center gap-2 text-sm hover:bg-orange-50 p-1 rounded"
            title="Mark as Duplicate"
          >
            {currentStatus === 'duplicate' ? 
              <CheckSquare className="w-4 h-4 text-orange-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-orange-700">مكرر</span>
          </button>

          <button
            onClick={() => updateEvaluation(path, currentStatus === 'merge' ? null : 'merge')}
            className="flex items-center gap-2 text-sm hover:bg-purple-50 p-1 rounded"
            title="Mark for Merge"
          >
            {currentStatus === 'merge' ? 
              <CheckSquare className="w-4 h-4 text-purple-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-purple-700">دمج</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {/* Local Development Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-600" />
            <Link 
              href={localUrl}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              localhost:3000{path}
            </Link>
          </div>
          <button
            onClick={() => copyToClipboard(localUrl, 'local')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Copy localhost URL"
          >
            {copied === `${path}-local` ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Vercel Production Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            <Link 
              href={vercelUrl}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel{path}
            </Link>
          </div>
          <button
            onClick={() => copyToClipboard(vercelUrl, 'vercel')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Copy Vercel URL"
          >
            {copied === `${path}-vercel` ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  emoji: string;
  description: string;
  pages: PageData[];
  defaultExpanded?: boolean;
  evaluations: Record<string, PageStatus>;
  updateEvaluation: (pagePath: string, status: PageStatus) => void;
}

function Section({ title, emoji, description, pages, defaultExpanded = false, evaluations, updateEvaluation }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    console.log(`Toggling section: ${title}, current state: ${isExpanded}`);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              <p className="text-xs text-blue-600 mt-1">{pages.length} pages</p>
            </div>
          </div>
          <ChevronDown 
            className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", 
              isExpanded && "rotate-180"
            )} 
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <PageLink 
                key={page.path} 
                {...page} 
                evaluations={evaluations}
                updateEvaluation={updateEvaluation}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlatformPagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluations, setEvaluations] = useState<Record<string, PageStatus>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Load evaluations from localStorage on component mount
  useEffect(() => {
    try {
      const savedEvaluations = localStorage.getItem(EVALUATIONS_STORAGE_KEY);
      if (savedEvaluations) {
        setEvaluations(JSON.parse(savedEvaluations));
      }
    } catch (error) {
      console.error('Failed to load evaluations from localStorage:', error);
    }
  }, []);

  // Save evaluations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(evaluations));
    } catch (error) {
      console.error('Failed to save evaluations to localStorage:', error);
    }
  }, [evaluations]);

  const updateEvaluation = (pagePath: string, status: PageStatus) => {
    setEvaluations(prev => ({
      ...prev,
      [pagePath]: status
    }));
  };

  const clearAllEvaluations = () => {
    if (confirm('Are you sure you want to clear all evaluations?')) {
      setEvaluations({});
      localStorage.removeItem(EVALUATIONS_STORAGE_KEY);
    }
  };

  const exportEvaluations = () => {
    const dataStr = JSON.stringify(evaluations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `platform-pages-evaluations-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importEvaluations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setEvaluations(importedData);
        alert('Evaluations imported successfully!');
      } catch (error) {
        alert('Failed to import evaluations. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Filter all pages based on search term
  const filteredSections = Object.entries(pagesSections).map(([key, section]) => {
    const filteredPages = section.pages.filter(page =>
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { key, section: { ...section, pages: filteredPages } };
  }).filter(({ section }) => section.pages.length > 0);

  // Calculate statistics
  const totalPages = Object.values(pagesSections).reduce((acc, section) => acc + section.pages.length, 0);
  const evaluatedPages = Object.keys(evaluations).filter(key => evaluations[key] !== null).length;
  const statusCounts = {
    working: Object.values(evaluations).filter(status => status === 'working').length,
    needFix: Object.values(evaluations).filter(status => status === 'needFix').length,
    delete: Object.values(evaluations).filter(status => status === 'delete').length,
    duplicate: Object.values(evaluations).filter(status => status === 'duplicate').length,
    merge: Object.values(evaluations).filter(status => status === 'merge').length
  };

  const toggleAllSections = () => {
    const allExpanded = Object.keys(pagesSections).every(key => expandedSections[key]);
    const newState = Object.keys(pagesSections).reduce((acc, key) => {
      acc[key] = !allExpanded;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSections(newState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏗️ Binna Platform - Comprehensive Pages Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Complete navigation hub for all 145+ platform pages with status tracking, evaluation tools, and direct access links. 
            Mark pages as working, need fix, delete, duplicate, or merge.
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{statusCounts.working}</div>
              <div className="text-sm text-gray-600">Working</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.needFix}</div>
              <div className="text-sm text-gray-600">Need Fix</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-red-600">{statusCounts.delete}</div>
              <div className="text-sm text-gray-600">Delete</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.duplicate}</div>
              <div className="text-sm text-gray-600">Duplicate</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{statusCounts.merge}</div>
              <div className="text-sm text-gray-600">Merge</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pages by name, description, or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={toggleAllSections}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Toggle All
            </button>
            <button
              onClick={exportEvaluations}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importEvaluations}
                className="hidden"
              />
            </label>
            <button
              onClick={clearAllEvaluations}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {filteredSections.map(({ key, section }) => (
            <Section
              key={key}
              title={section.title}
              emoji={section.emoji}
              description={section.description}
              pages={section.pages}
              defaultExpanded={expandedSections[key] || false}
              evaluations={evaluations}
              updateEvaluation={updateEvaluation}
            />
          ))}
        </div>

        {filteredSections.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pages found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Last Updated: January 2025 | Total Platform Pages: {totalPages}</p>
          <p>Use the evaluation checkboxes to mark page status and track platform health</p>
        </div>
      </div>
    </div>
  );
}



