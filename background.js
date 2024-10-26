// Function to delete a cookie by name and path
function deleteCookie(name, domain) {
  const paths = ['/', '/path/', '/cookiepath/', '/morepath/', '/allpaths/'];
  
  if (domain) {
      // Delete cookie for specific domain
      paths.forEach(path => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=${path}`;
      });
  } else {
      // Delete cookie for current domain
      paths.forEach(path => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      });
  }
}

// Function to clear cookies for a specific domain
async function clearCookiesForDomain(domain) {
  const cookies = await chrome.cookies.getAll({ domain });
  cookies.forEach(cookie => {
      deleteCookie(cookie.name, domain);
      deleteCookie(cookie.name, `.${domain}`); // Try subdomains
  });
}

// Function to clear local storage, session storage, and cookies
async function clearDataForDomain(domain) {
  console.log(`Clearing data for domain: ${domain}`);
  
  // Clear cookies for the domain and subdomains
  await clearCookiesForDomain(domain);

  // Clear local storage and session storage
  chrome.storage.local.clear();
  chrome.storage.session.clear();
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearData") {
      clearDataForDomain("papergames.io").then(() => {
          sendResponse({ status: "success", message: "Data cleared!" });
      });
      return true; // Keep the message channel open for asynchronous response
  }
});
