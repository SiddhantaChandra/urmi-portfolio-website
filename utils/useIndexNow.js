"use client";

import { useCallback } from 'react';

export function useIndexNow() {
  const submitUrl = useCallback(async (url) => {
    try {
      const response = await fetch('/api/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
          url: url
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('IndexNow: URL submitted successfully:', url);
        return true;
      } else {
        console.warn('IndexNow: Failed to submit URL:', result.message);
        return false;
      }
    } catch (error) {
      console.error('IndexNow: Error submitting URL:', error);
      return false;
    }
  }, []);

  const submitUrls = useCallback(async (urls) => {
    try {
      const response = await fetch('/api/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'multiple',
          urls: urls
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('IndexNow: URLs submitted successfully:', urls.length);
        return true;
      } else {
        console.warn('IndexNow: Failed to submit URLs:', result.message);
        return false;
      }
    } catch (error) {
      console.error('IndexNow: Error submitting URLs:', error);
      return false;
    }
  }, []);

  const submitAllArticles = useCallback(async () => {
    try {
      const response = await fetch('/api/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'all'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('IndexNow: All articles submitted successfully');
        return true;
      } else {
        console.warn('IndexNow: Failed to submit all articles:', result.message);
        return false;
      }
    } catch (error) {
      console.error('IndexNow: Error submitting all articles:', error);
      return false;
    }
  }, []);

  return {
    submitUrl,
    submitUrls,
    submitAllArticles
  };
} 