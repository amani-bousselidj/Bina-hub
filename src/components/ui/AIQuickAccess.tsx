import React from 'react';
import Link from 'next/link';
import { Brain, Calculator, Bot, Lightbulb } from 'lucide-react';

interface AIQuickAccessProps {
  currentPage?: string;
  className?: string;
}

export default function AIQuickAccess({ currentPage, className = '' }: AIQuickAccessProps) {
  const getRecommendedTools = () => {
    switch (currentPage) {
      case 'expenses':
        return [
          { name: 'استخراج ذكي من الفواتير', href: '/user/ai-hub?feature=expense-tracker', icon: <Brain className="w-4 h-4" /> },
          { name: 'الحاسبة الشاملة', href: '/user/comprehensive-construction-calculator', icon: <Calculator className="w-4 h-4" /> }
        ];
      case 'warranties':
        return [
          { name: 'استخراج بيانات الضمان', href: '/user/warranties/ai-extract', icon: <Brain className="w-4 h-4" /> },
          { name: 'تتبع ذكي للمصروفات', href: '/user/warranty-expense-tracking', icon: <Lightbulb className="w-4 h-4" /> }
        ];
      case 'projects':
        return [
          { name: 'المستشار الذكي', href: '/user/smart-construction-advisor', icon: <Bot className="w-4 h-4" /> },
          { name: 'الحاسبة الشاملة', href: '/user/comprehensive-construction-calculator', icon: <Calculator className="w-4 h-4" /> }
        ];
      default:
        return [
          { name: 'مركز الذكاء الاصطناعي', href: '/user/ai-hub', icon: <Brain className="w-4 h-4" /> },
          { name: 'المساعد الذكي', href: '/user/ai-assistant', icon: <Bot className="w-4 h-4" /> }
        ];
    }
  };

  const recommendedTools = getRecommendedTools();

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <div className="group">
        {/* Main AI Button */}
        <Link href="/user/ai-hub">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" onClick={() => alert('Button clicked')}>
            <Brain className="w-6 h-6" />
          </button>
        </Link>
        
        {/* Quick Tools Popup */}
        <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-64">
            <p className="text-sm font-semibold text-gray-800 mb-2">🤖 أدوات ذكية مقترحة</p>
            <div className="space-y-2">
              {recommendedTools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-purple-600">{tool.icon}</div>
                    <span className="text-sm text-gray-700">{tool.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t mt-2 pt-2">
              <Link href="/user/ai-smart-features-test">
                <div className="text-xs text-orange-600 hover:text-orange-700 cursor-pointer">
                  🧪 اختبار الميزات الذكية
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


