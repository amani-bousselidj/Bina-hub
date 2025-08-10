// @ts-nocheck
// Simple onboarding tour component for first-time users
import { useState } from 'react';

const steps = [
  { title: 'مرحبًا بك في منصة بناء!', desc: 'ابدأ رحلتك في البناء بسهولة مع دليلنا.' },
  { title: 'مشاريعك', desc: 'تابع مشاريعك خطوة بخطوة من خلال لوحة التحكم.' },
  { title: 'الطلبات', desc: 'اطلب مواد البناء وتابع حالتها بسهولة.' },
  { title: 'الضمانات', desc: 'تابع ضمانات المنتجات واطلب خدمة الضمان عند الحاجة.' },
  { title: 'الدعم والمساعدة', desc: 'تواصل مع الدعم أو زر مركز المساعدة في أي وقت.' },
];

export default function OnboardingTour({ onFinish }: { onFinish?: () => void }) {
  const [step, setStep] = useState(0);
  if (step >= steps.length) {
    if (onFinish) onFinish();
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">{steps[step].title}</h2>
        <p className="mb-4 text-gray-700">{steps[step].desc}</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" onClick={() => setStep(s => s + 1)}>
          {step === steps.length - 1 ? 'ابدأ الآن' : 'التالي'}
        </button>
      </div>
    </div>
  );
}




