"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/core/shared/auth/AuthProvider";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  LogOut, 
  ShoppingCart, 
  Store, 
  Home, 
  Building2, 
  TrendingUp,
  Users,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  MapPin,
  UserCheck,
  Shield,
  Hammer,
  Truck,
  FileText,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function MainHeader() {
  const { user, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJourneyDropdownOpen, setIsJourneyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide header on dashboard pages since they have their own header
  if (pathname?.startsWith('/user/dashboard')) {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsJourneyDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    {
      label: "الرئيسية",
      href: "/",
      icon: Home
    },
    {
      label: "السوق الإلكتروني",
      href: "/marketplace",
      icon: Store
    },
    {
      label: "أسعار المواد",
      href: "/material-prices",
      icon: TrendingUp
    },
    {
      label: "المشاريع العامة",
      href: "/projects",
      icon: Building2
    },
    {
      label: "المشرفين",
      href: "/supervisors",
      icon: Users
    },
    {
      label: "المنتدى",
      href: "/forum",
      icon: MessageSquare
    }
  ];

  const journeySteps = [
    {
      label: "شراء الأرض",
      href: "/journey/construction-journey/land-purchase",
      icon: MapPin
    },
    {
      label: "اختيار المقاول",
      href: "/journey/construction-journey/contractor-selection",
      icon: UserCheck
    },
    {
      label: "التسوير",
      href: "/journey/construction-journey/fencing",
      icon: Shield
    },
    {
      label: "الحفر والتجهيز",
      href: "/journey/construction-journey/excavation",
      icon: Hammer
    },
    {
      label: "التأمين",
      href: "/journey/construction-journey/insurance",
      icon: Shield
    },
    {
      label: "إدارة النفايات",
      href: "/journey/construction-journey/waste-disposal",
      icon: Truck
    },
    {
      label: "مراجعة المخططات",
      href: "/journey/construction-journey/blueprint-approval",
      icon: FileText
    },
    {
      label: "التنفيذ",
      href: "/journey/construction-journey/execution",
      icon: Eye
    }
  ];

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800">بنا هب</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Construction Journey Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsJourneyDropdownOpen(!isJourneyDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
              >
                <Building2 className="w-4 h-4" />
                رحلة البناء
                <ChevronDown className={`w-4 h-4 transition-transform ${isJourneyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isJourneyDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[110]">
                  {journeySteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <Link
                        key={step.href}
                        href={step.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                        onClick={() => setIsJourneyDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full text-indigo-600 text-xs font-medium">
                          {index + 1}
                        </div>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{step.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">{user.email}</span>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={signOut}
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Mobile Journey Steps */}
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-500 mb-2">رحلة البناء</div>
                <div className="space-y-1 mr-4">
                  {journeySteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <Link
                        key={step.href}
                        href={step.href}
                        className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center w-5 h-5 bg-indigo-100 rounded-full text-indigo-600 text-xs font-medium">
                          {index + 1}
                        </div>
                        <Icon className="w-4 h-4" />
                        {step.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="px-4 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-700">{user.email}</div>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={signOut}
                      disabled={isLoading}
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/login" className="block">
                      <Button 
                        variant="outline" 
                        className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        تسجيل الدخول
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        إنشاء حساب
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
