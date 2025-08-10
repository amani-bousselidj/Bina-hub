// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/enhanced-components';

export function EvaluationSection({ userId }: { userId: string }) {
  // Placeholder for fetching evaluations
  // const [evaluations, setEvaluations] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // Save evaluation to backend
    alert('تم إرسال التقييم');
    setRating(0);
    setComment('');
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8" dir="rtl">
      <h3 className="text-lg font-bold mb-4">التقييمات</h3>
      <div className="flex items-center gap-2 mb-2">
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(star)}
          >★</span>
        ))}
      </div>
      <textarea
        className="w-full p-3 border rounded-lg mb-2"
        placeholder="اكتب تعليقك هنا..."
        value={comment}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={rating === 0 || !comment.trim()}
      >
        إرسال التقييم
      </Button>
      {/* List of previous evaluations can be rendered here */}
    </div>
  );
}





