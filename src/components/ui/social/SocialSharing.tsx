"use client";

import React, { useState } from 'react';

interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: (url: string, text: string) => string;
}

interface SocialSharingProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'vertical' | 'dropdown';
  platforms?: string[];
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = '',
  description = '',
  className = "",
  size = 'md',
  variant = 'horizontal',
  platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'copy']
}) => {
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const socialPlatforms: Record<string, SocialPlatform> = {
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700',
      shareUrl: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    },
    twitter: {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-sky-500 hover:bg-sky-600',
      shareUrl: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700 hover:bg-blue-800',
      shareUrl: (url, text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500 hover:bg-green-600',
      shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    },
    telegram: {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-500 hover:bg-blue-600',
      shareUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    },
    reddit: {
      name: 'Reddit',
      icon: '🤖',
      color: 'bg-orange-600 hover:bg-orange-700',
      shareUrl: (url, text) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    },
    pinterest: {
      name: 'Pinterest',
      icon: '📌',
      color: 'bg-red-600 hover:bg-red-700',
      shareUrl: (url, text) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`
    }
  };

  const shareText = title + (description ? ` - ${description}` : '');

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      handleCopyLink();
      return;
    }

    const socialPlatform = socialPlatforms[platform];
    if (socialPlatform) {
      const shareUrl = socialPlatform.shareUrl(url, shareText);
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-sm';
      case 'lg': return 'w-12 h-12 text-lg';
      default: return 'w-10 h-10 text-base';
    }
  };

  const activePlatforms = platforms.filter(platform => 
    socialPlatforms[platform] || platform === 'copy'
  );

  const renderShareButton = (platform: string, index: number) => {
    if (platform === 'copy') {
      return (
        <button
          key="copy"
          onClick={handleCopyLink}
          className={`${getSizeClasses()} flex items-center justify-center rounded-full transition-colors duration-200 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title={copied ? 'Copied!' : 'Copy Link'}
        >
          {copied ? '✅' : '🔗'}
        </button>
      );
    }

    const socialPlatform = socialPlatforms[platform];
    if (!socialPlatform) return null;

    return (
      <button
        key={platform}
        onClick={() => handleShare(platform)}
        className={`${getSizeClasses()} flex items-center justify-center rounded-full text-white transition-colors duration-200 ${socialPlatform.color}`}
        title={`Share on ${socialPlatform.name}`}
      >
        {socialPlatform.icon}
      </button>
    );
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>📤</span>
          <span>Share</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
            <div className="py-2">
              {activePlatforms.map((platform, index) => {
                if (platform === 'copy') {
                  return (
                    <button
                      key="copy"
                      onClick={handleCopyLink}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <span>{copied ? '✅' : '🔗'}</span>
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  );
                }

                const socialPlatform = socialPlatforms[platform];
                if (!socialPlatform) return null;

                return (
                  <button
                    key={platform}
                    onClick={() => {
                      handleShare(platform);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <span>{socialPlatform.icon}</span>
                    <span>{socialPlatform.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const containerClasses = variant === 'vertical' 
    ? 'flex flex-col space-y-2' 
    : 'flex space-x-2';

  return (
    <div className={`${containerClasses} ${className}`}>
      {activePlatforms.map(renderShareButton)}
    </div>
  );
};

export default SocialSharing;


