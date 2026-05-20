'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Bot,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';

// Helper to extract text content from UIMessage parts
function getMessageText(message: UIMessage): string {
  if (!message.parts) return '';
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map(part => part.text)
    .join('');
}

const AUTO_OPEN_DELAY = 5000; // 5 seconds
const STORAGE_KEY = 'chatbot_shown';

export default function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showAttention, setShowAttention] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if on admin or auth pages
  const isAdminPage = pathname?.includes('/admin');
  const isAuthPage = pathname?.includes('/sign-in') || pathname?.includes('/sign-up');

  // Auto-open chat after delay for first-time visitors (only on public pages)
  useEffect(() => {
    if (isAdminPage || isAuthPage) return;
    
    const hasShownBefore = sessionStorage.getItem(STORAGE_KEY);
    
    if (!hasShownBefore && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
        setShowAttention(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
        
        // Try to play sound (may be blocked by browser)
        try {
          const audio = new Audio('/sounds/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Sound blocked - that's okay, we have visual feedback
          });
        } catch {
          // Audio not supported
        }
      }, AUTO_OPEN_DELAY);

      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened, isAdminPage, isAuthPage]);
  
  const initialMessages: UIMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hallo! 👋 Willkommen bei Tori Planen. Wie kann ich Ihnen heute helfen?' }],
    },
  ];

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: initialMessages,
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setIsMinimized(false);
    
    // Mark as shown when user interacts
    if (newIsOpen) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Don't render on admin or auth pages
  if (isAdminPage || isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Chat öffnen"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl overflow-hidden flex flex-col ${showAttention ? 'ring-4 ring-primary/50 ring-offset-2' : ''}`}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Tori Planen Assistent</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Maximieren' : 'Minimieren'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Chat schließen"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-white rounded-tr-sm'
                            : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="text-center text-red-500 text-sm py-2">
                      Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    sendMessage({ text: input });
                    setInput('');
                  }
                }} className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Schreiben Sie eine Nachricht..."
                      className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Nachricht senden"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Powered by AI • Tori Planen
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
