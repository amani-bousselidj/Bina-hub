// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTranslation } from '@/core/shared/hooks/useTranslation';
import { formatDate } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface Message {
  id: string;
  sender_id: string;
  sender_type: 'user' | 'supervisor';
  sender_name: string;
  content: string;
  timestamp: string;
  attachment_url?: string;
  read: boolean;
}

interface ChatProps {
  userId: string;
  supervisorId?: string;
  projectId?: string;
  className?: string;
}

export default function SupervisorChat({ userId, supervisorId, projectId, className }: ChatProps) {
  const { t, locale } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages on component mount and when conversation parameters change
  useEffect(() => {
    if (userId && (supervisorId || projectId)) {
      fetchMessages();
    }
  }, [userId, supervisorId, projectId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      if (supervisorId) queryParams.append('supervisorId', supervisorId);
      if (projectId) queryParams.append('projectId', projectId);

      const response = await fetch(`/api/chat/messages?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachmentFile) return;

    setLoading(true);
    setError(null);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('userId', userId);
      if (supervisorId) formData.append('supervisorId', supervisorId);
      if (projectId) formData.append('projectId', projectId);
      formData.append('content', newMessage);
      if (attachmentFile) formData.append('attachment', attachmentFile);

      const response = await fetch('/api/chat/send', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Get the sent message from response
      const data = await response.json();
      
      // Add the new message to the messages array
      setMessages([...messages, data.message]);
      
      // Clear input fields
      setNewMessage('');
      setAttachmentFile(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] shadow-lg rounded-lg overflow-hidden ${className}`}>
      <CardContent className="flex flex-col h-full p-0">
        {/* Chat header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span>{t('chat.title')}</span>
              {projectId && (
                <Badge variant="outline" className="ml-2 text-sm border-white/30 text-white">
                  {t('chat.project')} {projectId}
                </Badge>
              )}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchMessages}
              className="border-white/30 text-white hover:bg-white/10"
            >
              ↻
            </Button>
          </div>
        </div>

        {/* Messages container */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner className="text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center p-4">
              <div className="inline-block p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                <p className="mb-2">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchMessages}
                  className="text-red-600 hover:bg-red-100"
                >
                  {t('retry')}
                </Button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
              <svg className="w-12 h-12 stroke-current opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>{t('chat.noMessages')}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                    message.sender_id === userId 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar 
                      size="sm" 
                      name={message.sender_name}
                      className="w-6 h-6 ring-2 ring-white/50" 
                    />
                    <span className={`text-xs font-medium ${
                      message.sender_id === userId ? 'text-white/90' : 'text-gray-700'
                    }`}>
                      {message.sender_name}
                    </span>
                    <span className={`text-xs ${
                      message.sender_id === userId ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {formatDate(message.timestamp, locale)}
                    </span>
                  </div>
                  
                  <div className={`text-sm ${
                    message.sender_id === userId ? 'text-white' : 'text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.attachment_url && (
                    <div className="mt-2">
                      <a 
                        href={message.attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-xs ${
                          message.sender_id === userId 
                            ? 'text-white/90 hover:text-white' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {t('chat.viewAttachment')}
                      </a>
                    </div>
                  )}

                  {/* Read indicator */}
                  {message.sender_id === userId && (
                    <div className={`text-right mt-1 ${message.read ? 'text-white/70' : 'text-white/40'}`}>
                      <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview */}
        {attachmentFile && (
          <div className="px-4 py-2 bg-gray-50 border-t flex items-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <Badge variant="outline" className="gap-2 bg-white">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="truncate max-w-[200px]">{attachmentFile.name}</span>
              <button 
                onClick={() => setAttachmentFile(null)}
                className="text-red-500 hover:bg-red-50 rounded-full p-1"
              >
                ✕
              </button>
            </Badge>
          </div>
        )}

        {/* Message input */}
        <div className="p-4 border-t bg-white flex gap-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <Input
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            placeholder={t('chat.typingMessage')}
            className="flex-1 bg-gray-50 focus:bg-white transition-colors"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleAttachmentClick}
            title={t('chat.attachment')}
            className="hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={loading || (!newMessage.trim() && !attachmentFile)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <span className="flex items-center gap-2">
                {t('chat.send')}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}








