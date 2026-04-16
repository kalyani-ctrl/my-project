# LinkedIn Visitor Enrichment Chrome Extension

A Chrome extension that captures LinkedIn company page visitors and sends them to your N8n workflow for enrichment via Explorium.

## 📦 Files Overview

```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (handles webhook requests)
├── content-script.js      # Runs on LinkedIn pages (extracts visitors)
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic and interactions
└── README.md              # This file
```

## 🔧 Installation

### Development Mode

1. **Extract the extension files** to your computer
2. **Open Chrome extensions page**
   - Type `chrome://extensions/` in address bar
   - Or: Menu → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle **Developer mode** (top right corner)

4. **Load the extension**
   - Click **Load unpacked**
   - Navigate to the `chrome-extension` folder
   - Click **Select Folder**

5. **Verify installation**
   - Extension icon should appear in toolbar
   - Pin the extension for easy access

### Packaged Installation (Distributable)

1. In `chrome://extensions/` with Developer mode on
2. Click **Pack extension**
3. Select the `chrome-extension` folder
4. Click **Pack Extension**
5. A `.crx` file will be created (this is your packaged extension)

## ⚙️ Configuration

### Initial Setup

1. **Click the extension icon** in your toolbar
2. **Enter your N8n webhook URL**
   ```
   https://your-n8n-instance.com/webhook/linkedin-visitors
   ```
3. **Click "Save Webhook URL"**

### Getting Your Webhook URL from N8n

1. Open your N8n workflow
2. Click the **"Webhook - Chrome Extension"** node
3. In the right panel, copy the **Webhook URL**
4. Paste it in the extension popup

### Testing the Configuration

1. Go to a LinkedIn company page
2. Click the extension icon
3. If configured correctly, webhook URL field should be populated
4. Click **Capture Page Visitors**

## 🚀 Usage

### Capturing Visitors

1. **Navigate to a LinkedIn company page**
   ```
   https://www.linkedin.com/company/google/
   https://www.linkedin.com/company/facebook/
   etc.
   ```

2. **Click the extension icon** in your toolbar

3. **Click "📊 Capture Page Visitors"**
   - The extension will extract visible visitors
   - Progress indicator shows while processing
   - Success message shows number of visitors captured

4. **Review captured count**
   - Shows as "X visitor(s) captured" on the popup
   - Number resets when data is sent

### Sending to N8n

1. **After capturing visitors**, click **"📤 Send to N8n"**
2. **Wait for confirmation**
   - Success message shows if sent successfully
   - Error message shows if there's an issue
3. **Data will appear in your Google Sheet**
   - Usually within 10-30 seconds
   - Check N8n execution logs if nothing appears

### Monitoring Statistics

- **Total Captured**: Cumulative count of all visitors ever captured
- **Last Capture**: When you last sent data to N8n
- **Refresh Stats**: Update statistics display

## 📊 What Gets Captured

The extension extracts from LinkedIn company pages:

```json
{
  "profileId": "john-doe",           // LinkedIn profile username
  "name": "John Doe",                 // Full name
  "headline": "Senior Engineer",      // Job title/headline
  "company": "Google",                // Company name
  "email": "",                        // Email (not always visible)
  "linkedinUrl": "https://linkedin.com/in/john-doe/",
  "timestamp": "2025-02-20T10:30:00Z"
}
```

## 🔍 How It Works

### Visitor Extraction Methods

The extension tries three methods to find visitors:

1. **Specific visitor cards** (if LinkedIn displays them)
   - Looks for elements with visitor-specific attributes
   - Most reliable when available

2. **Recent activity section**
   - Extracts from page activity feed
   - Useful for recent visitor tracking

3. **Profile links**
   - Extracts all LinkedIn profile links on page
   - Most comprehensive but may include non-visitors

### Deduplication at N8n

The N8n workflow handles deduplication:
- Compares captured profiles with existing Google Sheet records
- Skips enrichment for profiles already processed
- Saves Explorium API credits

## 🛡️ Privacy & Permissions

The extension requests these permissions:

| Permission | Why | What it accesses |
|---|---|---|
| `activeTab` | Know what page you're viewing | Current tab info only |
| `scripting` | Extract visitor data | LinkedIn company pages only |
| `storage` | Save your webhook URL | Local browser storage |
| `tabs` | Get page information | Tab metadata only |
| `host_permissions` | Run on LinkedIn pages | Only linkedin.com |

**What it does NOT do:**
- ❌ Collect your LinkedIn password
- ❌ Access your private messages
- ❌ Read your connections
- ❌ Monitor all browsing activity
- ❌ Send data anywhere except your N8n webhook

## ⚠️ Limitations & Considerations

### LinkedIn Display Limitations

- **Not all company pages show visitors**
  - Depends on company page settings
  - Some smaller/private pages don't display visitors
  - Visitor info may be limited

- **Visibility depends on your account**
  - Some visitor info only visible to company admins
  - Limited data on public company pages

- **Rate limiting**
  - LinkedIn may limit how often you can view company pages
  - Spread captures over time

### Extension Limitations

- **Only works on company pages**
  - Not for individual posts
  - Not for job listings
  - Specifically: `linkedin.com/company/...`

- **Browser-based extraction**
  - Depends on what's currently visible
  - Page must be fully loaded
  - Works with current LinkedIn page structure

- **Local operation**
  - All extraction happens in your browser
  - No data stored on our servers
  - Only sent when you click "Send to N8n"

## 🐛 Troubleshooting

### Extension icon not showing

**Problem**: Extension doesn't appear in toolbar

**Solutions**:
1. Go to `chrome://extensions/`
2. Find "LinkedIn Visitor Enrichment"
3. Make sure it's **Enabled** (toggle should be blue)
4. If missing, check if it was disabled or removed
5. Try reloading: click refresh icon next to extension

### "No visitors found" message

**Problem**: Capture shows no visitors despite being on company page

**Causes**:
- Company page doesn't display visitors
- You're logged out or not authorized
- Page isn't fully loaded
- Different page structure than expected

**Solutions**:
1. Verify you're on: `linkedin.com/company/...`
2. Look for "Visitors" section on the page
3. Make sure you're logged into LinkedIn
4. Scroll down - visitors may be below the fold
5. Try a different company page to test
6. Check console (F12 → Console tab) for errors

### "Failed to send visitors" error

**Problem**: Can't send captured data to N8n

**Causes**:
- Webhook URL is incorrect
- N8n instance is down/offline
- Network/firewall blocking connection
- Webhook is disabled in N8n

**Solutions**:
1. Verify webhook URL is copied correctly
2. Test URL in new browser tab (should show error or response)
3. Check if N8n instance is running
4. Try sending again (sometimes network hiccups occur)
5. Review N8n logs for errors
6. Check firewall/VPN settings

### Webhook URL lost after refresh

**Problem**: Webhook URL disappears after closing/reopening extension

**Cause**: Browser storage settings or extension not properly installed

**Solutions**:
1. Check that extension is fully enabled
2. Try re-entering webhook URL
3. Check browser is allowing extension to store data
4. Try reinstalling extension

### Email field empty in Google Sheet

**Problem**: Email column is blank even after enrichment

**Cause**: LinkedIn doesn't show email addresses on company visitor pages

**This is expected**. The N8n workflow uses Explorium to enrich the email address from the name and company information.

## 🔄 Workflow Integration

### Complete Flow

```
1. You visit LinkedIn company page
2. Extension extracts visible visitors
3. You click "Send to N8n"
4. Extension sends to webhook
5. N8n receives visitor data
6. N8n checks Google Sheet for duplicates
7. N8n calls Explorium API for enrichment
8. N8n appends enriched data to Google Sheet
9. Your CRM or sales team can access data
```

### Real-time Notifications (Optional)

You can configure N8n to send you:
- Slack notifications when visitors are enriched
- Email summaries of new visitors
- SMS alerts for VIP companies
- Calendar reminders to follow up

## 📈 Tips for Best Results

1. **Visit company pages regularly**
   - More visits = more visitor captures
   - Different times show different visitors

2. **Use on relevant company pages**
   - Target companies you want to reach
   - Focus on industries that matter to you

3. **Capture in batches**
   - Visit 3-5 company pages
   - Send data all at once
   - More efficient than single captures

4. **Monitor your Google Sheet**
   - Check data quality
   - Remove invalid entries
   - Use for sales targeting

5. **Manage Explorium credits**
   - Each new visitor uses credits
   - Deduplication saves credits
   - Monitor your API usage

## 🔐 Security Reminders

1. **Keep your webhook URL private**
   - Don't share it publicly
   - It's like an API key
   - Treat it as sensitive

2. **Regular testing**
   - Test extension occasionally
   - Verify it still sends data
   - Check N8n logs

3. **Extension updates**
   - Keep extension installed and enabled
   - Update if Chrome suggests updates
   - Check for new versions

## 📞 Support

### Check These First

- ✅ Is webhook URL correct?
- ✅ Is N8n instance running?
- ✅ Are you on a LinkedIn company page?
- ✅ Is Google Sheet accessible?
- ✅ Are API credentials valid?

### Debug Steps

1. **Check browser console** (F12 → Console)
   - Look for error messages
   - Copy error details

2. **Check N8n logs**
   - Click workflow name
   - Scroll to execution list
   - Click failed execution for details

3. **Test webhook manually**
   ```bash
   curl -X POST https://your-n8n-url/webhook/linkedin-visitors \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

4. **Enable extension logging**
   - The extension logs to console
   - F12 → Console tab
   - Look for "LinkedIn Visitor" messages

## 📚 Related Resources

- **Main Setup Guide**: `../LINKEDIN_VISITOR_ENRICHMENT_SETUP.md`
- **N8n Docs**: https://docs.n8n.io
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **LinkedIn Company Pages**: https://www.linkedin.com/company/

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Compatibility**: Chrome 88+
