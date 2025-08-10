// @ts-nocheck
'use client';

import { useState } from 'react';

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type Features = {
  user: Feature[];
  store: Feature[];
};

const features: Features = {
  user: [
    {
      title: "إدارة المشاريع",
      description: "تتبع وإدارة مشاريع البناء الخاصة بك بسهولة",
      icon: "🏗️"
    },
    {
      title: "طلب المواد",
      description: "اطلب مواد البناء من المتاجر المحلية",
      icon: "📦"
    },
    {
      title: "الإشراف المهني",
      description: "احصل على إشراف من خبراء البناء",
      icon: "👷"
    }
  ],
  store: [
    {
      title: "عرض المنتجات",
      description: "اعرض منتجاتك لعملاء البناء",
      icon: "🏪"
    },
    {
      title: "إدارة الطلبات",
      description: "تتبع وإدارة طلبات العملاء",
      icon: "📋"
    },
    {
      title: "تحليل المبيعات",
      description: "احصل على تقارير وتحليلات المبيعات",
      icon: "📊"
    }
  ]
};

export default function FeatureToggle() {
  const [activeFeature, setActiveFeature] = useState<'user' | 'store'>('user');

  return (
    <>
      {/* Feature Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-white rounded-full p-2 shadow-lg">
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeFeature === 'user'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveFeature('user')}
          >
            للمستخدمين
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeFeature === 'store'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveFeature('store')}
          >
            للمتاجر
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features[activeFeature].map((feature, index) => (            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 group shadow-lg"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}




