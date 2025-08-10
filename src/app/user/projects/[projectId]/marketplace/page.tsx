import React from 'react';
import { Store, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ProjectMarketplacePage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">سوق المشروع</h1>
        <p className="text-sm text-gray-500 mt-1">بيع وشراء المنتجات والخدمات المتعلقة بالمشروع</p>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 text-center">
          <Store className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-500">المنتجات المتاحة</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-500">الطلبات النشطة</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">45,230</p>
          <p className="text-sm text-gray-500">إجمالي المبيعات (ر.س)</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">28</p>
          <p className="text-sm text-gray-500">العملاء النشطين</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">المنتجات والخدمات</h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              إضافة منتج جديد
            </button>
          </div>

          {/* Sample Products */}
          <div className="space-y-3">
            {[
              { name: "أسمنت مسلح عالي الجودة", price: "45 ر.س/كيس", status: "متوفر", sales: 24 },
              { name: "حديد التسليح قطر 12مم", price: "2,800 ر.س/طن", status: "متوفر", sales: 12 },
              { name: "خدمات النجارة والتشطيب", price: "180 ر.س/متر", status: "محجوز", sales: 8 },
              { name: "أجهزة كهربائية للمشروع", price: "1,200 ر.س", status: "متوفر", sales: 6 },
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-green-600 font-semibold mt-1">{product.price}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'متوفر' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.status}
                      </span>
                      <span>{product.sales} عملية بيع</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">تعديل</button>
                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">عرض</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">الطلبات الأخيرة</h3>
            <div className="space-y-3">
              {[
                { customer: "أحمد المطيري", item: "أسمنت مسلح", amount: "1,080 ر.س", time: "منذ ساعتين" },
                { customer: "سارة الأحمد", item: "خدمات نجارة", amount: "2,340 ر.س", time: "منذ 4 ساعات" },
                { customer: "محمد العتيبي", item: "حديد تسليح", amount: "5,600 ر.س", time: "أمس" },
              ].map((order, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-gray-600">{order.item}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-green-600 font-semibold">{order.amount}</span>
                    <span className="text-gray-400 text-xs">{order.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">إجراءات سريعة</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
                إنشاء عرض خاص
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
                تقرير المبيعات
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
                إدارة المخزون
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
                إعدادات الدفع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
