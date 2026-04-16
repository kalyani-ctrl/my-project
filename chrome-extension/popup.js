/**
 * Popup Script for Chrome Extension
 * Handles UI interactions and communication with background script
 */

let capturedVisitors = [];

// Initialize popup on load
document.addEventListener('DOMContentLoaded', () => {
  loadWebhookUrl();
  refreshStats();
});

/**
 * Save webhook URL to local storage
 */
function saveWebhookUrl() {
  const webhookUrl = document.getElementById('webhookUrl').value.trim();

  if (!webhookUrl) {
    showStatus('Please enter a webhook URL', 'error');
    return;
  }

  // Validate URL format
  try {
    new URL(webhookUrl);
  } catch (error) {
    showStatus('Invalid URL format', 'error');
    return;
  }

  chrome.runtime.sendMessage({
    type: 'SAVE_WEBHOOK_URL',
    webhookUrl: webhookUrl
  }, response => {
    if (response?.success) {
      showStatus('✓ Webhook URL saved successfully', 'success');
    } else {
      showStatus('Error saving webhook URL', 'error');
    }
  });
}

/**
 * Load webhook URL from storage
 */
function loadWebhookUrl() {
  chrome.runtime.sendMessage({
    type: 'GET_WEBHOOK_URL'
  }, response => {
    if (response?.webhookUrl) {
      document.getElementById('webhookUrl').value = response.webhookUrl;
    }
  });
}

/**
 * Capture visitors from current page
 */
function captureVisitors() {
  const button = event.target.closest('button');
  const spinner = document.createElement('span');
  spinner.className = 'spinner';

  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = spinner.outerHTML + 'Capturing...';

  // Get active tab
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];

    // Check if we're on LinkedIn
    if (!activeTab.url.includes('linkedin.com')) {
      showStatus('❌ You must be on a LinkedIn company page', 'error');
      button.disabled = false;
      button.innerHTML = originalText;
      return;
    }

    // Execute content script to extract visitors
    chrome.tabs.executeScript(activeTab.id, {
      code: `
        const visitors = window.getPageVisitors ? window.getPageVisitors() : [];
        chrome.runtime.sendMessage({
          type: 'VISITORS_EXTRACTED',
          visitors: visitors
        });
      `
    }, (results) => {
      // Note: In MV3, we should use scripting API instead
      // Fallback to sending message to content script
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'GET_VISITORS'
      }, response => {
        if (response?.visitors) {
          capturedVisitors = response.visitors;
          displayCapturedVisitors(capturedVisitors);
          showStatus(`✓ Captured ${capturedVisitors.length} visitor(s)`, 'success');
        } else {
          showStatus('No visitors found on this page. Make sure you\'re on a company page with visible visitors.', 'info');
        }

        button.disabled = false;
        button.innerHTML = originalText;
      });
    });
  });
}

/**
 * Send captured visitors to N8n
 */
function sendCapturedVisitors() {
  if (capturedVisitors.length === 0) {
    showStatus('No captured visitors to send. Please capture visitors first.', 'error');
    return;
  }

  const webhookUrl = document.getElementById('webhookUrl').value.trim();
  if (!webhookUrl) {
    showStatus('Webhook URL not configured', 'error');
    return;
  }

  const button = event.target.closest('button');
  const spinner = document.createElement('span');
  spinner.className = 'spinner';

  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = spinner.outerHTML + 'Sending...';

  // Send via background script
  chrome.runtime.sendMessage({
    type: 'VISITORS_CAPTURED',
    visitors: capturedVisitors
  }, response => {
    if (response?.success) {
      showStatus(`✓ Successfully sent ${capturedVisitors.length} visitor(s) to N8n`, 'success');
      capturedVisitors = []; // Clear after sending
      document.getElementById('visitorCount').classList.remove('show');
      refreshStats();
    } else {
      showStatus(`Error: ${response?.message || 'Failed to send visitors'}`, 'error');
    }

    button.disabled = false;
    button.innerHTML = originalText;
  });
}

/**
 * Display count of captured visitors
 */
function displayCapturedVisitors(visitors) {
  const countDiv = document.getElementById('visitorCount');
  countDiv.textContent = `${visitors.length} visitor(s) captured`;
  countDiv.classList.add('show');
}

/**
 * Refresh statistics
 */
function refreshStats() {
  chrome.runtime.sendMessage({
    type: 'GET_STATS'
  }, response => {
    // Update total captured
    document.getElementById('totalCaptured').textContent = response?.totalCaptured || 0;

    // Update last capture time
    if (response?.lastCaptureTime) {
      const lastCapture = new Date(response.lastCaptureTime);
      const now = new Date();
      const diffMs = now - lastCapture;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeStr;
      if (diffMins < 1) {
        timeStr = 'Just now';
      } else if (diffMins < 60) {
        timeStr = `${diffMins} minute(s) ago`;
      } else if (diffHours < 24) {
        timeStr = `${diffHours} hour(s) ago`;
      } else {
        timeStr = `${diffDays} day(s) ago`;
      }

      document.getElementById('lastCapture').textContent = timeStr;
    } else {
      document.getElementById('lastCapture').textContent = 'Never';
    }
  });
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status show ${type}`;

  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 5000);
}

/**
 * Open documentation
 */
function openDocumentation() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('../LINKEDIN_VISITOR_ENRICHMENT_SETUP.md')
  });
}

/**
 * Listen for messages from content script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_VISITORS') {
    // Content script is requesting visitors
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];

      chrome.tabs.sendMessage(activeTab.id, {
        type: 'EXTRACT_VISITORS'
      }, response => {
        sendResponse(response);
      });
    });
    return true;
  }
});
