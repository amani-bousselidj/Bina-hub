"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function OrderTrackPage() {
  const params = useSearchParams();
  const initialOrderNumber = (params && (params.get("orderNumber") || params.get("order_number"))) || "";
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const sp = new URLSearchParams();
  if (orderNumber) sp.set("order_number", orderNumber);
      if (email) sp.set("email", email);
      if (phone) sp.set("phone", phone);
      const res = await fetch(`/api/orders/track?${sp.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load order");
      setOrder(json.order || json.data || json);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">تتبع الطلب</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrder();
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
      >
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="رقم الطلب"
          className="border rounded px-3 py-2 md:col-span-2"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد (اختياري)"
          className="border rounded px-3 py-2"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="الهاتف (اختياري)"
          className="border rounded px-3 py-2"
        />
        <div className="md:col-span-4">
          <Button type="submit" disabled={loading}>
            {loading ? "جاري البحث..." : "بحث"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm mb-4">{error}</div>
      )}

      {order && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">طلب رقم: {order.order_number || order.id}</h2>
            <span className="text-sm text-gray-600">الحالة: {order.status || "قيد المعالجة"}</span>
          </div>
          <div className="space-y-2 text-sm">
            {order.customer && (
              <div>العميل: {order.customer.name || order.customer.email || order.customer.phone}</div>
            )}
            <div>الإجمالي: {order.total || order.total_amount || 0}</div>
          </div>
          {order.items && order.items.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">العناصر</h3>
              <ul className="divide-y">
                {order.items.map((it: any, idx: number) => (
                  <li key={idx} className="py-2 flex justify-between text-sm">
                    <span className="truncate mr-2">{it.product_name || it.product_id}</span>
                    <span>{it.quantity} × {it.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
