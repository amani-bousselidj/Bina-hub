"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/core/shared/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency } from "@/core/shared/currency/format";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, session, isLoading: authLoading } = useAuth();
  const search = useSearchParams();
  const projectId = (search?.get('projectId') || cart.projectId) || undefined;
  const cartItems = cart.items;
  const totalAmount = getCartTotal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.name || user.email?.split('@')[0] || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
  const payload: any = {
        customer: {
          name,
          email: email || undefined,
          phone: phone || undefined,
        },
        items: cartItems.map((i: any) => ({
          product_id: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      };
  if (projectId) payload.project_id = projectId;

      // Use different endpoint based on authentication status
      const endpoint = user ? "/api/orders/authenticated-checkout" : "/api/orders/guest-checkout";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(session && { "Authorization": `Bearer ${session.access_token}` })
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Checkout failed");

      setOrderNumber(json.order_number || json.orderNumber || null);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-green-800 mb-2">تم إنشاء طلبك بنجاح</h1>
          <p className="text-green-700 mb-4">رقم الطلب: <span className="font-mono">{orderNumber}</span></p>
          <div className="flex gap-3">
            <Link href={`/orders/track?orderNumber=${orderNumber}`}>
              <Button>تتبع الطلب</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline">متابعة التسوق</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-2xl text-center">
        <h1 className="text-2xl font-semibold mb-2">سلة التسوق فارغة</h1>
        <p className="text-gray-600 mb-6">أضف بعض المنتجات قبل إتمام الشراء.</p>
        <Link href="/marketplace"><Button>تصفح المنتجات</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        {user ? `إتمام الشراء - ${user.name || user.email}` : "إتمام الشراء كضيف"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form className="md:col-span-2 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="اكتب اسمك"
              disabled={!!(user && user.name)} // Disable if user is logged in and has a name
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                البريد الإلكتروني {user ? "" : "(اختياري)"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="example@email.com"
                disabled={!!(user && user.email)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الهاتف (اختياري)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                placeholder="05xxxxxxxx"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm">{error}</div>
          )}

          <Button type="submit" disabled={submitting} className="w-full md:w-auto">
            {submitting ? "جاري المعالجة..." : "إصدار الطلب والدفع عند الاستلام"}
          </Button>
        </form>

        <div className="md:col-span-1 border rounded-lg p-4 h-fit">
          <h2 className="font-semibold mb-3">ملخص الطلب</h2>
          <ul className="divide-y">
            {cartItems.map((item: any) => (
              <li key={item.id} className="py-2 flex justify-between text-sm">
                <span className="truncate mr-2">{item.name || item.product_name}</span>
                <span>{item.quantity} × {formatCurrency(item.price)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-semibold">
            <span>الإجمالي</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
