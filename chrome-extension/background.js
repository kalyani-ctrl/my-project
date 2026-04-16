/**
 * Background Service Worker
 * Handles communication between content script and popup
 * Manages webhook requests to N8n
 */

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'VISITORS_CAPTURED') {
    // Send visitors to N8n webhook
    sendVisitorsToN8n(message.visitors)
      .then(response => {
        sendResponse({
          success: true,
          message: 'Visitors sent to N8n successfully',
          data: response
        });
      })
      .catch(error => {
        sendResponse({
          success: false,
          message: 'Error sending visitors to N8n',
          error: error.message
        });
      });

    // Return true to indicate we'll send response asynchronously
    return true;
  }

  if (message.type === 'GET_WEBHOOK_URL') {
    chrome.storage.local.get('webhookUrl', (result) => {
      sendResponse({
        webhookUrl: result.webhookUrl || ''
      });
    });
    return true;
  }

  if (message.type === 'SAVE_WEBHOOK_URL') {
    chrome.storage.local.set({ webhookUrl: message.webhookUrl }, () => {
      sendResponse({
        success: true,
        message: 'Webhook URL saved'
      });
    });
    return true;
  }

  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(['totalCaptured', 'lastCaptureTime'], (result) => {
      sendResponse({
        totalCaptured: result.totalCaptured || 0,
        lastCaptureTime: result.lastCaptureTime || null
      });
    });
    return true;
  }
});

/**
 * Send visitors data to N8n webhook
 * @param {Array} visitors - Array of visitor objects
 * @returns {Promise}
 */
function sendVisitorsToN8n(visitors) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('webhookUrl', (result) => {
      const webhookUrl = result.webhookUrl;

      if (!webhookUrl) {
        reject(new Error('Webhook URL not configured. Please set it in the extension popup.'));
        return;
      }

      // Prepare payload
      const payload = {
        body: visitors,
        source: 'chrome-extension',
        capturedAt: new Date().toISOString(),
        visitorCount: visitors.length
      };

      // Send to N8n webhook
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          // Update statistics
          chrome.storage.local.get('totalCaptured', (result) => {
            const currentTotal = result.totalCaptured || 0;
            chrome.storage.local.set({
              totalCaptured: currentTotal + visitors.length,
              lastCaptureTime: new Date().toISOString()
            });
          });

          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  });
}

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open popup (handled by popup.html)
});
