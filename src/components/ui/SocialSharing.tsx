// @ts-nocheck
'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link, Copy, Download, Image as ImageIcon } from 'lucide-react';

interface SocialSharingProps {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  className?: string;
  showBinnaWatermark?: boolean;
}

export default function SocialSharing({
  title,
  description,
  url = '',
  imageUrl,
  hashtags = [],
  className = '',
  showBinnaWatermark = true
}: SocialSharingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const binnaHashtags = showBinnaWatermark ? ['منصة_بنا', 'BinnaHub', 'مواد_البناء', 'السعودية'] : [];
  const allHashtags = [...hashtags, ...binnaHashtags];
  
  const shareText = showBinnaWatermark 
    ? `${title}\n\n${description}\n\nمن منصة بنا - BinnaHub`
    : `${title}\n\n${description}`;

  const socialPlatforms = [
    {
      name: 'واتساب',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    },
    {
      name: 'تويتر',
      icon: Twitter,
      color: 'bg-blue-400 hover:bg-blue-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}${allHashtags.length ? `&hashtags=${allHashtags.join(',')}` : ''}`
    },
    {
      name: 'فيسبوك',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'تلجرام',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handlePlatformShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
  };

  const generateShareImage = () => {
    // This would generate a custom share image with BinnaHub branding
    // For now, we'll create a data URL for a simple branded image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // BinnaHub logo area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title.substring(0, 50), canvas.width / 2, 200);

    // Description
    ctx.font = '32px Arial';
    const words = description.split(' ');
    let line = '';
    let y = 280;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 200 && i > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[i] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
      if (y > 400) break; // Limit description height
    }
    ctx.fillText(line, canvas.width / 2, y);

    // BinnaHub branding
    if (showBinnaWatermark) {
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText('منصة بنا - BinnaHub', canvas.width / 2, canvas.height - 100);
    }

    // Download the image
    const link = document.createElement('a');
    link.download = 'binna-share-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        مشاركة
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">مشاركة المحتوى</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Content Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
              <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
              {showBinnaWatermark && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  من منصة بنا - BinnaHub
                </div>
              )}
            </div>

            {/* Social Platforms */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformShare(platform)}
                  className={`${platform.color} text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-colors`}
                >
                  <platform.icon className="w-5 h-5" />
                  {platform.name}
                </button>
              ))}
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Copy className="w-5 h-5 text-green-600" />
                    تم النسخ!
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5" />
                    نسخ الرابط
                  </>
                )}
              </button>

              {/* Generate Share Image */}
              <button
                onClick={generateShareImage}
                className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-lg transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                تحميل صورة للمشاركة
              </button>
            </div>

            {/* Hashtags */}
            {allHashtags.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">الهاشتاجات المقترحة:</p>
                <div className="flex flex-wrap gap-2">
                  {allHashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* BinnaHub Branding */}
            {showBinnaWatermark && (
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  مشاركة من منصة <span className="font-semibold text-green-600">بنا - BinnaHub</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}




