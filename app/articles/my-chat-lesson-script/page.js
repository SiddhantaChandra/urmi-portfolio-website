'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiPlay, HiPause, HiStop, HiRefresh, HiSparkles, HiClock, HiCalendar, HiEye } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { cn } from '../../../utils/cn';

export default function MyChatLessonPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const loadChatFile = async () => {
      try {
        const response = await fetch('/articles/contentWriting/MyChatLesson.txt');
        if (!response.ok) {
          throw new Error('Failed to load chat file');
        }
        const chatText = await response.text();
        parseChatContent(chatText);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChatFile();
  }, []);

  const parseChatContent = (chatText) => {
    const lines = chatText.split('\n').filter(line => line.trim());
    const parsedMessages = lines.map((line, index) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const sender = line.substring(0, colonIndex).trim();
        const message = line.substring(colonIndex + 1).trim();
        return {
          id: index,
          sender: sender,
          message: message,
          timestamp: new Date(Date.now() + index * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return null;
    }).filter(Boolean);
    
    setMessages(parsedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessageIndex]);

  const startAutoPlay = () => {
    setIsPlaying(true);
    setCurrentMessageIndex(0);
    intervalRef.current = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev >= messages.length - 1) {
          setIsPlaying(false);
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const showAllMessages = () => {
    setCurrentMessageIndex(messages.length - 1);
    stopAutoPlay();
  };

  const resetChat = () => {
    setCurrentMessageIndex(0);
    stopAutoPlay();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500 font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Chat</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors duration-300"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  const visibleMessages = messages.slice(0, currentMessageIndex + 1);

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-pulse animation-delay-2000" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className={cn(
              "absolute rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-20 dark:opacity-10",
              i % 2 === 0 ? "w-4 h-4" : "w-6 h-6"
            )}
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-200/50 dark:border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg mb-2"
              >
                <HiSparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interactive Learning
                </span>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  History Study Session
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">L tutoring K about Sources of History</p>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={isPlaying ? stopAutoPlay : startAutoPlay}
                disabled={currentMessageIndex >= messages.length - 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300",
                  isPlaying
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed dark:disabled:from-gray-600 dark:disabled:to-gray-700'
                )}
              >
                {isPlaying ? <HiPause className="w-4 h-4" /> : <HiPlay className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Auto Play'}
              </motion.button>
              
              <motion.button
                onClick={showAllMessages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors duration-300"
              >
                <HiStop className="w-4 h-4" />
                Show All
              </motion.button>
              
              <motion.button
                onClick={resetChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium transition-colors duration-300"
              >
                <HiRefresh className="w-4 h-4" />
                Reset
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mb-8 pb-8 border-b border-purple-200/50 dark:border-purple-500/30"
        >
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <HiCalendar className="w-4 h-4" />
              <span>Interactive Sample</span>
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="w-4 h-4" />
              <span>Study Session</span>
            </div>
            <div className="flex items-center gap-2">
              <HiEye className="w-4 h-4" />
              <span>Educational Content</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg h-[70vh] flex flex-col overflow-hidden border border-white/50 dark:border-gray-700/50"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="font-bold text-lg">📚</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Study Chat</h2>
                  <p className="text-sm opacity-90">
                    Messages: {currentMessageIndex + 1} / {messages.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-700/50 dark:to-gray-800/30">
            {visibleMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: index * 0.01 }}
                className={`flex ${msg.sender === 'L' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm backdrop-blur-sm",
                    msg.sender === 'L'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto'
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border border-white/50 dark:border-gray-600/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-xs font-medium",
                      msg.sender === 'L' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {msg.sender === 'L' ? 'Tutor' : 'Student'}
                    </span>
                    <span className={cn(
                      "text-xs",
                      msg.sender === 'L' ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                    )}>
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input (Disabled) */}
          <div className="p-4 border-t border-purple-200/50 dark:border-purple-500/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-1 px-4 py-2 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg backdrop-blur-sm">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  This is a replay of a completed lesson...
                </span>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-300/80 dark:bg-gray-600/80 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed backdrop-blur-sm"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>

        {/* Article Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: 0.15 }}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            About This Interactive Lesson
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4"
          >
            This is a recreation of an actual tutoring session where L (tutor) teaches K (student) about the Sources of History. 
            The lesson demonstrates effective one-on-one teaching methods and interactive learning techniques.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.25 }}
            className="flex flex-wrap gap-2"
          >
            {['Education', 'History', 'Tutoring', 'Interactive Learning'].map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, delay: 0.3 + (index * 0.02) }}
                className="px-3 py-1 bg-purple-100/80 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 text-sm rounded-full backdrop-blur-sm"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => router.push('/articles')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, delay: 0.2 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
          >
            View More Articles
          </motion.button>
        </motion.div>
      </div>

      {/* CSS for grid background */}
      <style jsx>{`
        .bg-grid-slate-100\\/50 {
          background-image: linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .dark .bg-grid-slate-700\\/20 {
          background-image: linear-gradient(rgba(71, 85, 105, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(71, 85, 105, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
} 