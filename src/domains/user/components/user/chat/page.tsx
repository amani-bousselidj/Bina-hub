'use client';

import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


// Simple UI Components defined inline to avoid import issues
const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: any) => {
  const baseClasses = 'font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  const sizeClasses: Record<string, string> = {
    default: 'px-4 py-2 rounded-lg',
    sm: 'px-3 py-1.5 text-sm rounded'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`} 
      {...props}
     onClick={() => alert('Button clicked')}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      {...props} 
    />
  );
};

const Badge = ({ variant = 'default', className = '', children, ...props }: { 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'; 
  children: React.ReactNode; 
  className?: string; 
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

interface Chat {
  id: string;
  name: string;
  type: 'supervisor' | 'store';
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isFromMe: boolean;
}

const dummyChats: Chat[] = [
  {
    id: '1',
    name: 'أحمد محمد العتيبي',
    type: 'supervisor',
    avatar: '/api/placeholder/50/50',
    lastMessage: 'سأبدأ العمل في المشروع غداً صباحاً',
    lastMessageTime: '10:30 ص',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'مؤسسة البناء المتطور',
    type: 'store',
    avatar: '/api/placeholder/50/50',
    lastMessage: 'تم تجهيز طلبكم وسيتم التوصيل اليوم',
    lastMessageTime: 'أمس',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'سعد عبدالله النجار',
    type: 'supervisor',
    avatar: '/api/placeholder/50/50',
    lastMessage: 'هل تريد تقدير تكلفة الأعمال الكهربائية؟',
    lastMessageTime: 'أمس',
    unreadCount: 1,
    isOnline: true
  }
];

const dummyMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: 'supervisor-1',
    senderName: 'أحمد العتيبي',
    content: 'مرحباً، شكراً لاختياري لمشروعك',
    timestamp: '09:00',
    type: 'text',
    isFromMe: false
  },
  {
    id: '2',
    chatId: '1',
    senderId: 'me',
    senderName: 'أنا',
    content: 'أهلاً وسهلاً، متى يمكنك البدء؟',
    timestamp: '09:15',
    type: 'text',
    isFromMe: true
  },
  {
    id: '3',
    chatId: '1',
    senderId: 'supervisor-1',
    senderName: 'أحمد العتيبي',
    content: 'سأبدأ العمل في المشروع غداً صباحاً',
    timestamp: '10:30',
    type: 'text',
    isFromMe: false
  }
];

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChats(dummyChats);
      setMessages(dummyMessages);
      setActiveChat(dummyChats[0]);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: activeChat.id,
      senderId: 'me',
      senderName: 'أنا',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'text',
      isFromMe: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, lastMessage: newMessage.trim(), lastMessageTime: 'الآن' }
        : chat
    ));
  };

  const selectChat = (chat: Chat) => {
    setActiveChat(chat);
    // Mark as read
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const getChatMessages = () => {
    return messages.filter(msg => msg.chatId === activeChat?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">المحادثات</h1>
        
        <div className="grid grid-cols-12 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="col-span-4">
            <Card className="h-full">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">المحادثات</h2>
              </div>
              <div className="overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeChat?.id === chat.id ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.isOnline && (
                          <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {chat.type === 'supervisor' ? 'مشرف' : 'متجر'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="col-span-8">
            <Card className="h-full flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={activeChat.avatar}
                          alt={activeChat.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {activeChat.isOnline && (
                          <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{activeChat.name}</h3>
                        <p className="text-sm text-gray-500">
                          {activeChat.isOnline ? 'متصل الآن' : 'آخر ظهور منذ ساعة'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                        <PhoneIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                        <VideoCameraIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getChatMessages().map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromMe ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.isFromMe
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromMe ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>اختر محادثة لبدء المراسلة</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}





