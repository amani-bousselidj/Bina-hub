import React from 'react';
import { 
  Bars3Icon, 
  ShoppingCartIcon, 
  UserIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick?: () => void;
  cartItemCount?: number;
  userName?: string;
}

/**
 * Unified header component for all domains
 * Consistent navigation across marketplace and stores
 */
export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  cartItemCount = 0,
  userName 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              <div className="flex items-center mr-4">
                <h1 className="text-2xl font-bold text-blue-600">بنّاء</h1>
                <span className="text-sm text-gray-500 mr-2">BINNA</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                الرئيسية
              </a>
              <a href="/stores" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                المتاجر
              </a>
              <a href="/construction" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                المشاريع الإنشائية
              </a>
              <a href="/experts" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                الخبراء
              </a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                من نحن
              </a>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden" onClick={() => alert('Button clicked')}>
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={() => alert('Button clicked')}>
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Wishlist */}
            <button className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={() => alert('Button clicked')}>
              <HeartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Shopping Cart */}
            <button className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={() => alert('Button clicked')}>
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              {userName ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden md:inline">
                    {userName}
                  </span>
                </div>
              ) : (
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => alert('Button clicked')}>
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden md:inline">تسجيل الدخول</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


