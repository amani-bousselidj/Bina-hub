import React from 'react';
import { 
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

/**
 * Unified footer component
 * Consistent footer across all domains
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-400 ml-2" />
              <h3 className="text-xl font-bold">بنّاء</h3>
            </div>
            <p className="text-gray-400 mb-4">
              منصة الشرق الأوسط الرائدة للتجارة الإلكترونية وإدارة المشاريع الإنشائية
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <GlobeAltIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <EnvelopeIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <PhoneIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">الرئيسية</a></li>
              <li><a href="/stores" className="hover:text-white">المتاجر</a></li>
              <li><a href="/construction" className="hover:text-white">المشاريع الإنشائية</a></li>
              <li><a href="/experts" className="hover:text-white">الخبراء</a></li>
              <li><a href="/about" className="hover:text-white">من نحن</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/pos" className="hover:text-white">نظام نقاط البيع</a></li>
              <li><a href="/inventory" className="hover:text-white">إدارة المخزون</a></li>
              <li><a href="/accounting" className="hover:text-white">المحاسبة</a></li>
              <li><a href="/crm" className="hover:text-white">إدارة العملاء</a></li>
              <li><a href="/analytics" className="hover:text-white">التحليلات</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 ml-2" />
                <span className="text-gray-400">الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 ml-2" />
                <span className="text-gray-400">+966 XX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 ml-2" />
                <span className="text-gray-400">info@binna.sa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 بنّاء. جميع الحقوق محفوظة.</p>
          <div className="mt-2 space-x-6">
            <a href="/privacy" className="hover:text-white">سياسة الخصوصية</a>
            <a href="/terms" className="hover:text-white">الشروط والأحكام</a>
            <a href="/support" className="hover:text-white">الدعم الفني</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


