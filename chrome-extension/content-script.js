/**
 * Content Script for LinkedIn Company Pages
 * Extracts visitor information from "Page Visitors" section
 */

// Wait for page to fully load
window.addEventListener('load', () => {
  // Send message to popup that we're on a company page
  chrome.runtime.sendMessage({
    type: 'PAGE_LOADED',
    url: window.location.href
  }).catch(() => {
    // Suppress error if background isn't listening
  });
});

/**
 * Extract visitor data from LinkedIn company page
 * Looks for recent visitor cards in the "Page Visitors" section
 */
function extractVisitors() {
  const visitors = [];

  try {
    // Method 1: Extract from visible visitor cards (if LinkedIn shows them)
    const visitorElements = document.querySelectorAll('[data-test-id*="visitor"], [aria-label*="visited"], .visitor-card');

    visitorElements.forEach(element => {
      const visitor = extractVisitorFromElement(element);
      if (visitor && visitor.profileId) {
        visitors.push(visitor);
      }
    });

    // Method 2: Extract from recently viewed profiles (if accessible)
    if (visitors.length === 0) {
      const recentProfiles = extractFromRecentActivity();
      visitors.push(...recentProfiles);
    }

    // Method 3: Extract from profile links in page
    if (visitors.length === 0) {
      const profiles = extractFromProfileLinks();
      visitors.push(...profiles);
    }

    return visitors;
  } catch (error) {
    console.error('Error extracting visitors:', error);
    return visitors;
  }
}

/**
 * Extract visitor data from a single element
 */
function extractVisitorFromElement(element) {
  try {
    const nameElement = element.querySelector('[data-test-id*="name"], .name, .profile-name, strong');
    const headlineElement = element.querySelector('[data-test-id*="headline"], .headline, .description');
    const profileLink = element.querySelector('a[href*="/in/"], a[href*="/company/"]');

    if (!nameElement && !profileLink) {
      return null;
    }

    const name = nameElement?.textContent?.trim() || extractNameFromLink(profileLink);
    const profileId = extractProfileId(profileLink?.href);
    const headline = headlineElement?.textContent?.trim() || '';

    if (!name || !profileId) {
      return null;
    }

    return {
      profileId,
      name,
      headline,
      linkedinUrl: profileLink?.href || '',
      company: extractCompanyFromPage(),
      email: '', // Email typically not visible on company page
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting from element:', error);
    return null;
  }
}

/**
 * Extract visitor info from recent activity section
 */
function extractFromRecentActivity() {
  const visitors = [];

  try {
    // Look for activity feed items
    const activityItems = document.querySelectorAll('[data-test-id*="activity"], .activity-item');

    activityItems.forEach(item => {
      const link = item.querySelector('a[href*="/in/"]');
      const nameText = item.textContent;

      if (link && nameText) {
        const profileId = extractProfileId(link.href);
        const name = link.textContent?.trim() || extractNameFromLink(link);

        if (profileId && name) {
          visitors.push({
            profileId,
            name,
            headline: extractHeadlineFromText(nameText),
            linkedinUrl: link.href,
            company: extractCompanyFromPage(),
            email: '',
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    return visitors;
  } catch (error) {
    console.error('Error extracting from recent activity:', error);
    return [];
  }
}

/**
 * Extract visitor info from all profile links on page
 */
function extractFromProfileLinks() {
  const visitors = [];
  const seenIds = new Set();

  try {
    const profileLinks = document.querySelectorAll('a[href*="/in/"]');

    profileLinks.forEach(link => {
      const profileId = extractProfileId(link.href);

      // Avoid duplicates
      if (profileId && !seenIds.has(profileId)) {
        seenIds.add(profileId);

        const name = link.textContent?.trim() || '';
        if (name && name.length > 1) {
          visitors.push({
            profileId,
            name,
            headline: '',
            linkedinUrl: link.href,
            company: extractCompanyFromPage(),
            email: '',
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    return visitors;
  } catch (error) {
    console.error('Error extracting from profile links:', error);
    return [];
  }
}

/**
 * Extract profile ID from LinkedIn URL
 * Handles: /in/username/, /in/username-abcd123
 */
function extractProfileId(url) {
  if (!url) return null;

  const match = url.match(/\/in\/([a-z0-9-]+)\/?/i);
  if (match && match[1]) {
    return match[1];
  }

  // Fallback: try to extract numeric ID
  const numMatch = url.match(/\/profile\/([0-9]+)/);
  if (numMatch && numMatch[1]) {
    return numMatch[1];
  }

  return null;
}

/**
 * Extract company name from page header
 */
function extractCompanyFromPage() {
  try {
    // Method 1: From page title
    const pageTitle = document.querySelector('h1, [data-test-id="top-card-title"]');
    if (pageTitle) {
      return pageTitle.textContent?.trim() || '';
    }

    // Method 2: From URL
    const match = window.location.pathname.match(/\/company\/([a-z0-9-]+)\/?/i);
    if (match && match[1]) {
      return match[1].replace(/-/g, ' ');
    }

    return '';
  } catch (error) {
    return '';
  }
}

/**
 * Extract name from LinkedIn URL
 */
function extractNameFromLink(link) {
  if (!link) return '';

  const match = link.href.match(/\/in\/([a-z0-9-]+)\/?/i);
  if (match && match[1]) {
    // Convert URL slug to readable name
    return match[1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  return link.textContent?.trim() || '';
}

/**
 * Extract headline from text content
 */
function extractHeadlineFromText(text) {
  // Look for job title patterns
  const patterns = [
    /([A-Za-z\s]+)\s+at\s+([A-Za-z0-9\s&]+)/,
    /([A-Za-z\s]+)\s+\|\s+([A-Za-z0-9\s&]+)/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return '';
}

/**
 * Public function to get visitors (called by popup)
 */
window.getPageVisitors = function() {
  return extractVisitors();
};

/**
 * Public function to send visitors to N8n
 */
window.sendVisitorsToN8n = function(visitors) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type: 'VISITORS_CAPTURED',
      visitors: visitors
    }, response => {
      if (response?.success) {
        resolve(response);
      } else {
        reject(new Error(response?.message || 'Failed to send visitors'));
      }
    });
  });
};
