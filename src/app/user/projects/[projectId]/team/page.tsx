"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, UserPlus, Trash2 } from 'lucide-react';

export default function ProjectTeamPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId as string;
  const [members, setMembers] = useState<any[]>([]);
  const [newMember, setNewMember] = useState({ user_id: '', role: 'member' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/projects/${projectId}/members`);
    const data = await res.json();
    setMembers(data.members || []);
  };

  useEffect(() => {
    if (projectId) load();
  }, [projectId]);

  const add = async () => {
    if (!newMember.user_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
      if (res.ok) {
        setNewMember({ user_id: '', role: 'member' });
        await load();
      }
    } finally { setLoading(false); }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/members?id=${id}`, { method: 'DELETE' });
      if (res.ok) await load();
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        <h1 className="text-xl font-semibold">فريق المشروع</h1>
      </div>

      <div className="flex gap-2">
        <Input placeholder="معرّف المستخدم (UUID)" value={newMember.user_id} onChange={(e) => setNewMember({ ...newMember, user_id: e.target.value })} />
        <select className="border rounded px-2" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
          <option value="member">عضو</option>
          <option value="supervisor">مشرف</option>
        </select>
        <Button onClick={add} disabled={loading} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> إضافة
        </Button>
      </div>

      <div className="bg-white border rounded-xl">
        {members.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">لا يوجد أعضاء بعد.</div>
        ) : (
          <ul className="divide-y">
            {members.map((m) => (
              <li key={m.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.user_id}</div>
                  <div className="text-xs text-gray-500">{m.role}</div>
                </div>
                <Button variant="outline" onClick={() => remove(m.id)} disabled={loading} className="flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> إزالة
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
