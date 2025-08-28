// Function to clear ALL browsing data for a domain using browsingData API
async function clearAllBrowsingData(domain) {
  console.log(`Clearing ALL browsing data for domain: ${domain}`);
  
  try {
    // Clear all cookies for the domain
    await chrome.browsingData.removeCookies({
      origins: [
        `https://${domain}`,
        `http://${domain}`,
        `https://www.${domain}`,
        `http://www.${domain}`,
        `https://*.${domain}`,
        `http://*.${domain}`
      ]
    });
    console.log('All cookies cleared using browsingData API');
    
    // Clear local storage for the domain
    await chrome.browsingData.removeLocalStorage({
      origins: [
        `https://${domain}`,
        `http://${domain}`,
        `https://www.${domain}`,
        `http://www.${domain}`,
        `https://*.${domain}`,
        `http://*.${domain}`
      ]
    });
    console.log('Local storage cleared using browsingData API');
    
    // Clear session storage, cache, and other data
    await chrome.browsingData.remove({
      origins: [
        `https://${domain}`,
        `http://${domain}`,
        `https://www.${domain}`,
        `http://www.${domain}`,
        `https://*.${domain}`,
        `http://*.${domain}`
      ]
    }, {
      cache: true,
      cacheStorage: true,
      cookies: true,
      indexedDB: true,
      localStorage: true,
      serviceWorkers: true,
      webSQL: true
    });
    console.log('All browsing data cleared');
    
  } catch (error) {
    console.error('Error clearing browsing data:', error);
    
    // Fallback: Clear cookies manually if browsingData fails
    await clearCookiesManually(domain);
  }
  
  // Also clear extension storage
  try {
    await chrome.storage.local.clear();
    await chrome.storage.session.clear();
    console.log('Extension storage cleared');
  } catch (error) {
    console.error('Error clearing extension storage:', error);
  }
}

// Fallback function to manually clear cookies
async function clearCookiesManually(domain) {
  console.log('Using fallback manual cookie clearing');
  const urls = [
    `https://${domain}`,
    `http://${domain}`,
    `https://www.${domain}`,
    `http://www.${domain}`
  ];
  
  for (const url of urls) {
    try {
      const cookies = await chrome.cookies.getAll({ url: url });
      for (const cookie of cookies) {
        await chrome.cookies.remove({ url: url, name: cookie.name });
        console.log(`Manually deleted cookie: ${cookie.name}`);
      }
    } catch (error) {
      console.log(`Failed to manually delete cookies for ${url}:`, error);
    }
  }
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearData") {
      clearAllBrowsingData("papergames.io").then(() => {
          sendResponse({ status: "success", message: "All data cleared completely!" });
      }).catch((error) => {
          console.error('Error in clearData:', error);
          sendResponse({ status: "error", message: "Error clearing data!" });
      });
      return true; // Keep the message channel open for asynchronous response
  }
});
