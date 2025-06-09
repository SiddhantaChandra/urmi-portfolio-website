'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiDocumentText, HiEye, HiClock, HiCalendar, HiSparkles, HiShare, HiHome, HiChevronRight } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Breadcrumb Component
const Breadcrumb = ({ article }) => {
  const router = useRouter();
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <button
            onClick={() => router.push('/')}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center"
          >
            <HiHome className="w-4 h-4 mr-1" />
            Home
          </button>
        </li>
        <li>
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li>
          <button
            onClick={() => router.push('/articles')}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            Articles
          </button>
        </li>
        <li>
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {article.category}
          </span>
        </li>
        <li>
          <HiChevronRight className="w-4 h-4" />
        </li>
        <li>
          <span className="text-gray-500 dark:text-gray-400 truncate max-w-xs">
            {article.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default function OnlineRomanceClient({ article }) {
  const [xmlContent, setXmlContent] = useState('');
  const [parsedContent, setParsedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadXMLFile = async () => {
      try {
        const response = await fetch('/articles/contentWriting/OnlineRelationship.xml');
        if (!response.ok) {
          throw new Error('Failed to load XML file');
        }
        const xmlText = await response.text();
        setXmlContent(xmlText);
        parseXMLContent(xmlText);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadXMLFile();
  }, []);

  const parseXMLContent = (xmlText) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const paragraphs = xmlDoc.getElementsByTagName('w:p');
      const content = [];
      
      for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        let paragraphHTML = '';
        
        const processNodes = (nodes) => {
          let result = '';
          
          for (let j = 0; j < nodes.length; j++) {
            const node = nodes[j];
            
            if (node.tagName === 'w:r') {
              const textNodes = node.getElementsByTagName('w:t');
              for (let k = 0; k < textNodes.length; k++) {
                result += textNodes[k].textContent || '';
              }
            } else if (node.tagName === 'w:del') {
              const author = node.getAttribute('w:author') || 'Unknown';
              const date = node.getAttribute('w:date') || '';
              
              // Extract text from w:delText nodes within the deletion
              const delTextNodes = node.getElementsByTagName('w:delText');
              let deletedText = '';
              for (let k = 0; k < delTextNodes.length; k++) {
                deletedText += delTextNodes[k].textContent || '';
              }
              
              // Also check for w:t nodes within w:r nodes in deletions
              if (!deletedText) {
                const delRuns = node.getElementsByTagName('w:r');
                for (let k = 0; k < delRuns.length; k++) {
                  const delTNodes = delRuns[k].getElementsByTagName('w:delText');
                  for (let l = 0; l < delTNodes.length; l++) {
                    deletedText += delTNodes[l].textContent || '';
                  }
                }
              }
              
              if (deletedText.trim()) {
                result += `<span class="deletion" data-author="${author}" data-date="${date}" title="Deleted by ${author}">${deletedText}</span>`;
              }
            } else if (node.tagName === 'w:ins') {
              const author = node.getAttribute('w:author') || 'Unknown';
              const date = node.getAttribute('w:date') || '';
              
              // Extract text from w:t nodes within the insertion
              const insRuns = node.getElementsByTagName('w:r');
              let insertedText = '';
              for (let k = 0; k < insRuns.length; k++) {
                const insTextNodes = insRuns[k].getElementsByTagName('w:t');
                for (let l = 0; l < insTextNodes.length; l++) {
                  insertedText += insTextNodes[l].textContent || '';
                }
              }
              
              if (insertedText.trim()) {
                result += `<span class="insertion" data-author="${author}" data-date="${date}" title="Inserted by ${author}">${insertedText}</span>`;
              }
            } else if (node.tagName === 'w:hyperlink') {
              const runs = node.getElementsByTagName('w:r');
              for (let k = 0; k < runs.length; k++) {
                const textNodes = runs[k].getElementsByTagName('w:t');
                for (let l = 0; l < textNodes.length; l++) {
                  result += textNodes[l].textContent || '';
                }
              }
            } else if (node.childNodes && node.childNodes.length > 0) {
              // Recursively process child nodes
              result += processNodes(node.childNodes);
            }
          }
          
          return result;
        };
        
        paragraphHTML = processNodes(para.childNodes);
        
        if (paragraphHTML.trim()) {
          const pPr = para.getElementsByTagName('w:pPr')[0];
          let isHeading = false;
          let isCentered = false;
          let level = 2;
          
          if (pPr) {
            const bold = pPr.getElementsByTagName('w:b')[0];
            const jc = pPr.getElementsByTagName('w:jc')[0];
            if (jc && jc.getAttribute('w:val') === 'center') {
              isCentered = true;
              level = 1;
            }
            if (bold || isCentered) {
              isHeading = true;
            }
          }
          
          const runs = para.getElementsByTagName('w:r');
          for (let j = 0; j < runs.length; j++) {
            const rPr = runs[j].getElementsByTagName('w:rPr')[0];
            if (rPr && rPr.getElementsByTagName('w:b')[0]) {
              if (paragraphHTML.length < 200) {
                isHeading = true;
              }
            }
          }
          
          if (isHeading) {
            content.push({
              type: 'heading',
              level: level,
              content: paragraphHTML
            });
          } else {
            content.push({
              type: 'paragraph',
              content: paragraphHTML
            });
          }
        }
      }
      
      setParsedContent(content);
    } catch (err) {
      setError('Failed to parse XML content: ' + err.message);
      console.error('XML parsing error:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || 'Online Romance in the Shadow of COVID-19',
          text: article?.excerpt || 'Research document examining online relationships during the COVID-19 pandemic',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderContent = () => {
    return parsedContent.map((item, index) => {
      if (item.type === 'heading') {
        const HeadingTag = `h${item.level}`;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: index * 0.02 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <HeadingTag 
              className={`font-bold text-gray-900 dark:text-gray-100 mb-4 font-sans ${
                item.level === 1 ? 'text-2xl' : 'text-xl'
              }`}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </motion.div>
        );
      } else {
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: index * 0.02 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base font-sans"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500 font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-500 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Document</h1>
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

  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-12 dark:opacity-6 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-12 dark:opacity-6 animate-pulse-slower" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
            }}
            transition={{
              duration: 16 + i * 3,
              repeat: Infinity,
              delay: i * 3.5,
              ease: "easeInOut",
            }}
            className="absolute rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-8 dark:opacity-4 w-4 h-4"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-200/50 dark:border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 shadow-lg"
              >
                <HiSparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content Writing
                </span>
              </motion.div>
            </div>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors duration-300"
            >
              <HiShare className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </div>
      </header>

      {/* Document Container */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb article={article} />
        
        {/* Article Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight font-sans"
        >
          {article?.title}
        </motion.h1>

        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-purple-200/50 dark:border-purple-500/30"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiDocumentText className="w-4 h-4" />
            <span className="font-medium">{article?.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiCalendar className="w-4 h-4" />
            <span>{new Date(article?.publishedDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiClock className="w-4 h-4" />
            <span>{article?.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <HiEye className="w-4 h-4" />
            <span>{article?.category}</span>
          </div>
        </motion.div>

        {/* Article Excerpt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.15 }}
          className="mb-12"
        >
          <div className="bg-purple-50/50 dark:bg-purple-900/20 backdrop-blur-sm rounded-lg p-6 border-l-4 border-purple-600 dark:border-purple-400">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light italic">
              {article?.excerpt}
            </p>
          </div>
        </motion.div>

        {/* Document Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-200/50 dark:border-purple-500/30 shadow-xl p-8 mb-8"
        >
          <div className="prose prose-lg max-w-none">
            {renderContent()}
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.25 }}
          className="mt-12 pt-8 border-t border-purple-200/50 dark:border-purple-500/30"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 font-sans">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article?.tags?.map((tag, index) => (
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
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => router.push('/articles')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
          >
            View More Articles
          </motion.button>
        </motion.div>
      </div>

      {/* CSS for grid background and editing styles */}
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

        .deletion {
          background-color: #fee2e2;
          color: #dc2626;
          text-decoration: line-through;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
        }

        .insertion {
          background-color: #dcfce7;
          color: #16a34a;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
        }

        .dark .deletion {
          background-color: #7f1d1d;
          color: #fca5a5;
        }

        .dark .insertion {
          background-color: #14532d;
          color: #86efac;
        }
      `}</style>
    </div>
  );
} 