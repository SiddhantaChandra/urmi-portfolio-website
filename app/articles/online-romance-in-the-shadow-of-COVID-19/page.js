'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiDocumentText, HiEye, HiClock, HiCalendar, HiSparkles, HiShare } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnlineRomanceEditingSamplePage() {
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
          title: 'Online Romance in the Shadow of COVID-19',
          text: 'Research document examining online relationships during the COVID-19 pandemic',
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
              className={`font-bold mb-6 text-gray-900 dark:text-gray-100 ${
                item.level === 1 ? 'text-3xl md:text-4xl text-center' : 
                'text-xl md:text-2xl'
              }`}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </motion.div>
        );
      } else {
        return (
          <motion.p 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: index * 0.01 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Article</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Track Changes Styles */}
      <style jsx global>{`
        .deletion {
          background-color: #fee2e2;
          color: #dc2626;
          text-decoration: line-through;
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid #fca5a5;
        }
        
        .insertion {
          background-color: #dcfce7;
          color: #16a34a;
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid #86efac;
        }
        
        /* Dark mode styles - using :global() for specificity */
        :global(.dark) .deletion {
          background-color: #7f1d1d;
          color: #fca5a5;
          border-color: #dc2626;
        }
        
        :global(.dark) .insertion {
          background-color: #14532d;
          color: #86efac;
          border-color: #16a34a;
        }
      `}</style>

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

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <HiCalendar className="w-4 h-4" />
              <span>Sample Document</span>
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="w-4 h-4" />
              <span>Editing Sample</span>
            </div>
            <div className="flex items-center gap-2">
              <HiEye className="w-4 h-4" />
              <span>Content Writing Portfolio</span>
            </div>
          </div>
        </motion.div>

        {/* Content Editing Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
            Content Editing Legend
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-red-200 dark:bg-red-800 border border-red-400 dark:border-red-600 rounded"></span>
              <span className="text-gray-700 dark:text-gray-300">Deleted text (track changes)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600 rounded"></span>
              <span className="text-gray-700 dark:text-gray-300">Inserted text (track changes)</span>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mb-8 relative rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src="/articles/contentWriting/Onlineromance.webp"
            alt="Online Romance in the Shadow of COVID-19"
            width={800}
            height={400}
            className="w-full h-64 md:h-80 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              Research document examining online relationships during the COVID-19 pandemic
            </p>
          </div>
        </motion.div>

        {/* Parsed Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.15 }}
          className="prose prose-lg max-w-none"
        >
          {renderContent()}
        </motion.div>

        {/* Article Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <motion.h3 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: 0.05 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            About This Document Sample
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4"
          >
            This document showcases content editing capabilities, including track changes functionality. 
            The article explores the impact of COVID-19 on online relationships and demonstrates 
            professional editing and revision workflows.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {['Content Editing', 'Track Changes', 'Document Review', 'COVID-19', 'Online Relationships'].map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, delay: 0.2 + (index * 0.02) }}
                viewport={{ once: true }}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => router.push('/articles')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, delay: 0.05 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
          >
            View More Articles
          </motion.button>
        </motion.div>
      </article>
    </div>
  );
} 