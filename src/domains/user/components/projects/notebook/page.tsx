'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';

export default function NotebookPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote('');
      setShowAddForm(false);
    }
  };

  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
              المذكرة
            </Typography>
            <Typography variant="body" className="text-gray-600">
              ملاحظاتك ومذكراتك الشخصية
            </Typography>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {notes.length === 0 ? (
            <EnhancedCard variant="elevated" className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4">
                ليس لديك أي ملاحظات بعد
              </Typography>
              <Typography variant="body" size="md" className="text-gray-600 mb-6">
                ليس لديك أي ملاحظه, قم بالإنضمام لنا واضف أول ملاحظه لك من هنا
              </Typography>
              <Button 
                onClick={() => setShowAddForm(true)}
                variant="filled"
                size="lg"
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                إضافة أول ملاحظة
              </Button>
            </EnhancedCard>
          ) : (
            <>
              <div className="mb-6">
                <Button 
                  onClick={() => setShowAddForm(true)}
                  variant="filled"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة ملاحظة جديدة
                </Button>
              </div>

              <div className="space-y-4">
                {notes.map((note, index) => (
                  <EnhancedCard key={index} variant="elevated" className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="body" size="md" className="text-gray-800 leading-relaxed">
                          {note}
                        </Typography>
                        <Typography variant="caption" size="sm" className="text-gray-500 mt-2">
                          {new Date().toLocaleDateString('en-US')}
                        </Typography>
                      </div>
                    </div>
                  </EnhancedCard>
                ))}
              </div>
            </>
          )}

          {showAddForm && (
            <EnhancedCard variant="elevated" className="p-6 mt-6">
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4">
                إضافة ملاحظة جديدة
              </Typography>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="اكتب ملاحظتك هنا..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
              />
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={handleAddNote} 
                  variant="filled"
                  disabled={!newNote.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  حفظ الملاحظة
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewNote('');
                  }}
                  variant="outline"
                >
                  إلغاء
                </Button>
              </div>
            </EnhancedCard>
          )}
        </div>
      </div>
    </main>
  );
}



