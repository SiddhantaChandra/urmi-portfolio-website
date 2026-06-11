// IndexNow implementation for instant search engine notifications
// Based on https://www.indexnow.org/documentation

const INDEXNOW_KEY = 'ab6a76142afb478687203d747ba106f1';
const SITE_HOST = 'urmichakraborty.com';

// Search engines that support IndexNow
const SEARCH_ENGINES = [
  'api.indexnow.org', // IndexNow API endpoint
  'www.bing.com',
];

/**
 * Submit a single URL to IndexNow
 * @param {string} url - The URL that has been added, updated, or deleted
 * @returns {Promise<boolean>} - Success status
 */
export async function submitUrlToIndexNow(url) {
  if (!url) {
    console.error('IndexNow: URL is required');
    return false;
  }

  // Ensure URL is properly formatted
  const encodedUrl = encodeURIComponent(url);
  
  const results = await Promise.allSettled(
    SEARCH_ENGINES.map(async (searchEngine) => {
      try {
        const indexNowUrl = `https://${searchEngine}/indexnow?url=${encodedUrl}&key=${INDEXNOW_KEY}`;
        
        const response = await fetch(indexNowUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Urmi Chakraborty Portfolio IndexNow Client'
          }
        });

        if (response.status === 200) {
          console.log(`IndexNow: Successfully submitted ${url} to ${searchEngine}`);
          return true;
        } else if (response.status === 202) {
          console.log(`IndexNow: URL accepted by ${searchEngine}, validation pending`);
          return true;
        } else {
          console.warn(`IndexNow: ${searchEngine} returned status ${response.status} for ${url}`);
          return false;
        }
      } catch (error) {
        console.error(`IndexNow: Error submitting to ${searchEngine}:`, error.message);
        return false;
      }
    })
  );

  const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
  console.log(`IndexNow: Successfully submitted ${url} to ${successCount}/${SEARCH_ENGINES.length} search engines`);
  
  return successCount > 0;
}

/**
 * Submit multiple URLs to IndexNow
 * @param {string[]} urls - Array of URLs that have been added, updated, or deleted
 * @returns {Promise<boolean>} - Success status
 */
export async function submitUrlsToIndexNow(urls) {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    console.error('IndexNow: URLs array is required');
    return false;
  }

  // Limit to 10,000 URLs per request as per documentation
  const urlsToSubmit = urls.slice(0, 10000);

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    urlList: urlsToSubmit
  };

  const results = await Promise.allSettled(
    SEARCH_ENGINES.map(async (searchEngine) => {
      try {
        const response = await fetch(`https://${searchEngine}/indexnow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': 'Urmi Chakraborty Portfolio IndexNow Client'
          },
          body: JSON.stringify(payload)
        });

        if (response.status === 200) {
          console.log(`IndexNow: Successfully submitted ${urlsToSubmit.length} URLs to ${searchEngine}`);
          return true;
        } else if (response.status === 202) {
          console.log(`IndexNow: URLs accepted by ${searchEngine}, validation pending`);
          return true;
        } else {
          console.warn(`IndexNow: ${searchEngine} returned status ${response.status}`);
          return false;
        }
      } catch (error) {
        console.error(`IndexNow: Error submitting batch to ${searchEngine}:`, error.message);
        return false;
      }
    })
  );

  const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
  console.log(`IndexNow: Successfully submitted ${urlsToSubmit.length} URLs to ${successCount}/${SEARCH_ENGINES.length} search engines`);
  
  return successCount > 0;
}

/**
 * Submit all article URLs for initial indexing (both www and non-www)
 * @returns {Promise<boolean>} - Success status
 */
export async function submitAllArticlesToIndexNow() {
  const baseUrls = [
    `https://${SITE_HOST}`,
    `https://www.${SITE_HOST}`
  ];
  
  const urlPaths = [
    '',
    '/articles',
    '/articles/my-chat-lesson',
    '/articles/bearing-selection-guide',
    '/articles/spring-twists-101',
    '/articles/tattoo-color-selection-guide',
    '/articles/morni-hills-travel-guide',
    '/articles/giardia-cats-comprehensive-guide'
  ];

  // Generate URLs for both domains
  const urls = [];
  baseUrls.forEach(baseUrl => {
    urlPaths.forEach(path => {
      urls.push(`${baseUrl}${path}`);
    });
  });

  console.log(`IndexNow: Submitting ${urls.length} URLs for both domains`);
  return await submitUrlsToIndexNow(urls);
}

/**
 * Throttled URL submission to prevent spam detection
 * @param {string} url - The URL to submit
 * @returns {Promise<boolean>} - Success status
 */
export async function submitUrlWithThrottle(url) {
  // Add small delay to prevent being flagged as spam
  await new Promise(resolve => setTimeout(resolve, 1000));
  return await submitUrlToIndexNow(url);
} 