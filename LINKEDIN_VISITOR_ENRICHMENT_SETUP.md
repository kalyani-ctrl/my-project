# LinkedIn Company Page Visitor Enrichment Workflow

Automated n8n workflow to capture LinkedIn company page visitors through a Chrome extension, deduplicate against existing records, enrich via Explorium, and save to Google Sheets.

## 📋 Features

- **Chrome Extension Integration**: Capture LinkedIn company page visitors directly from the browser
- **Automatic Deduplication**: Skip enrichment for profiles already in your Google Sheet
- **Explorium Enrichment**: Enrich visitor data with comprehensive profile information
- **Google Sheets Storage**: Automatically save enriched visitor data
- **Cost Optimization**: Avoid duplicate Explorium API credits by deduplicating first
- **Error Handling**: Graceful error handling and retry logic
- **Statistics Tracking**: Monitor total visitors captured and processing status

## 🚀 Quick Start

### Step 1: Set Up N8n Workflow

1. Open n8n
2. Click **Workflows** → **Import Workflow**
3. Select `linkedin-visitor-enrichment-workflow.json`
4. Click **Import**

### Step 2: Configure Credentials

#### Google Sheets OAuth2
1. In n8n: **Credentials** → **New** → **Google Sheets OAuth2**
2. Complete OAuth authorization
3. Name it: `google-sheets-credentials`

#### Explorium API Credentials
1. In n8n: **Credentials** → **New** → **HTTP Header Auth**
2. Header Name: `Authorization`
3. Header Value: `Bearer YOUR_EXPLORIUM_API_KEY`
4. Name it: `explorium-api-credentials`

### Step 3: Update Workflow Configuration

1. Open the imported workflow
2. **Node: "Get Existing Visitors from Sheet"**
   - Set your Google Sheet ID
   - Set sheet name: `Visitors`

3. **Node: "Enrich via Explorium"**
   - Update API endpoint if using custom Explorium setup
   - Verify credentials are set

4. **Node: "Append to Google Sheets"**
   - Set your Google Sheet ID (same as step 2)
   - Verify columns match your sheet headers

### Step 4: Create Google Sheet

1. Create a new Google Sheet
2. Name the first sheet: `Visitors`
3. Add these headers in row 1:
   ```
   profileId | name | email | headline | company | phone | address | industry | companySize | linkedinUrl | timestamp | enrichedAt | skills | workHistory
   ```

4. Share the sheet with your n8n service account (if using self-hosted)

### Step 5: Set Up Chrome Extension

#### Option A: Install from Directory (Development)

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Navigate to `chrome-extension/` folder in this project
5. Click **Select Folder**

#### Option B: Package for Distribution

1. In `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Pack extension**
4. Select the `chrome-extension` folder
5. Keep private key if prompted
6. A `.crx` file will be created

### Step 6: Configure Extension

1. Click the extension icon in your browser toolbar
2. Enter your N8n webhook URL:
   ```
   https://your-n8n-instance.com/webhook/linkedin-visitors
   ```
3. Click **Save Webhook URL**

### Step 7: Get Webhook URL from N8n

1. Open your workflow in n8n
2. Click the **Webhook - Chrome Extension** node
3. Copy the **Webhook URL**
4. This is what you paste in Step 6

### Step 8: Test & Deploy

1. Go to a LinkedIn company page (e.g., `linkedin.com/company/google/`)
2. Click the extension icon
3. Click **📊 Capture Page Visitors**
4. Wait for visitors to be extracted
5. Click **📤 Send to N8n**
6. Check your Google Sheet for new records

## 🔧 Configuration Details

### Workflow Architecture

```
Chrome Extension
     ↓
Webhook Trigger (n8n)
     ↓
Get Existing Visitors (Google Sheets)
     ↓
Deduplicate (JavaScript Code)
     ↓
Split for Processing
     ↓
Enrich via Explorium
     ↓
Merge Data
     ↓
Append to Google Sheets
     ↓
Return Success Response
```

### Deduplication Logic

The workflow deduplicates based on:
1. **LinkedIn Profile ID** (primary key) - Always checked
2. **Email Address** (secondary) - Checked if email is provided

This ensures:
- No duplicate enrichment API calls
- No wasted Explorium credits
- Clean, unique visitor records

### Data Enrichment

Explorium provides:
- Phone number
- Physical address
- Industry classification
- Company size
- Years at company
- LinkedIn connection count
- Skills (array)
- Work history

## 📊 Input/Output Format

### Webhook Input from Chrome Extension

```json
{
  "body": [
    {
      "profileId": "john-doe",
      "name": "John Doe",
      "headline": "Senior Software Engineer",
      "company": "Google",
      "email": "john@example.com",
      "linkedinUrl": "https://www.linkedin.com/in/john-doe/",
      "timestamp": "2025-02-20T10:30:00Z"
    }
  ],
  "source": "chrome-extension",
  "capturedAt": "2025-02-20T10:30:00Z",
  "visitorCount": 1
}
```

### Google Sheets Output

| profileId | name | email | headline | company | phone | address | industry | companySize | linkedinUrl | timestamp | enrichedAt | skills | workHistory |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| john-doe | John Doe | john@example.com | Senior Software Engineer | Google | +1-555-0123 | San Francisco, CA | Technology | 10000+ | https://linkedin.com/in/john-doe/ | 2025-02-20T10:30:00Z | 2025-02-20T10:35:00Z | Python, Go, Cloud | Software Engineer at Company1 \| Product Manager at Company2 |

## 🔐 Security Best Practices

1. **Webhook URL Protection**
   - Keep your N8n webhook URL private
   - Consider adding authentication to the webhook
   - Rotate webhook URL periodically

2. **API Key Security**
   - Store API keys in n8n credentials (never hardcode)
   - Use least-privilege API keys
   - Rotate keys regularly

3. **Data Privacy**
   - Ensure compliance with GDPR/CCPA
   - Limit data retention period
   - Archive or delete old visitor data

4. **Extension Security**
   - Only install from trusted sources
   - Review extension permissions
   - Keep extension updated

## 🐛 Troubleshooting

### Issue: Extension doesn't appear in browser toolbar
**Solution:**
1. Go to `chrome://extensions/`
2. Make sure extension is enabled
3. Check that manifest.json is valid
4. Reload extension (click refresh icon)

### Issue: "No visitors found" after clicking Capture
**Solutions:**
1. Make sure you're on a LinkedIn company page (`linkedin.com/company/...`)
2. The company page must show visitor information
3. Try scrolling down to ensure page is fully loaded
4. Some company pages may not display visitor info publicly
5. Check browser console (F12) for JavaScript errors

### Issue: "Failed to send visitors" error
**Solutions:**
1. Verify webhook URL is correct
2. Check N8n webhook is activated (toggle on)
3. Ensure network connectivity
4. Check firewall rules
5. Test webhook URL in Postman first

### Issue: Webhook URL shows as invalid
**Solutions:**
1. Check URL format: `https://your-n8n.com/webhook/linkedin-visitors`
2. Make sure N8n instance is running
3. Verify webhook is active in n8n
4. Check if proxy/firewall is blocking requests

### Issue: No data appearing in Google Sheets
**Solutions:**
1. Verify Google Sheet ID is correct
2. Ensure sheet name is "Visitors"
3. Check that headers are present in row 1
4. Verify Google OAuth credentials are still valid
5. Check n8n execution logs for errors

### Issue: Explorium enrichment returning empty data
**Solutions:**
1. Verify API key is valid and active
2. Check if profile email/name is sufficient for matching
3. Confirm API endpoint is correct
4. Check Explorium credit balance
5. Review API response in n8n logs

### Issue: High Explorium costs due to duplicates
**Solutions:**
1. The workflow includes deduplication - verify it's enabled
2. Check if existing Google Sheet has all past visitors
3. Manually remove duplicates from Google Sheet if needed
4. Consider archiving old data to separate sheet

## 📈 Advanced Configuration

### Custom Explorium Endpoint

If using a custom Explorium setup:
1. Edit **"Enrich via Explorium"** node
2. Change URL to your endpoint
3. Update request body if needed
4. Test with sample data

### Add Custom Enrichment Fields

To capture additional fields:
1. Edit **"Merge Enrichment Data"** node
2. Add new fields from Explorium response
3. Update Google Sheets headers
4. Update **"Append to Google Sheets"** columns

### Filter by Data Quality

To only enrich high-quality profiles:
1. Add a **Filter** node after deduplication
2. Set condition: `email != null AND name.length > 3`
3. This ensures we only enrich quality leads

### Send Slack Notifications

To get notified when visitors are enriched:
1. Add a **Slack** node after Google Sheets
2. Configure with your Slack webhook
3. Format message with visitor details
4. This creates real-time alerts

## 📝 Extension Permissions Explained

The Chrome extension requests:
- `activeTab` - To detect current page
- `scripting` - To extract visitor data
- `storage` - To save webhook URL
- `tabs` - To get tab information
- `host_permissions` - To run on LinkedIn pages

These are necessary to:
1. Detect LinkedIn company pages
2. Extract visitor information
3. Store your webhook configuration
4. Communicate with N8n

## 🔄 Regular Maintenance

### Weekly
- Check Google Sheet for data quality
- Monitor Explorium credit usage
- Verify webhook is still active

### Monthly
- Archive old visitor data (30+ days)
- Review and clean up duplicates
- Check Explorium API documentation for updates

### Quarterly
- Rotate API keys
- Review data retention policies
- Test disaster recovery

## 📚 Integration Examples

### Connect to CRM

1. Add CRM node after Google Sheets
2. Map visitor fields to CRM contact
3. Create automatic lead entries
4. Update existing records if duplicate

### Send Email Campaigns

1. Add Email node after enrichment
2. Use visitor email for outreach
3. Include enriched data in email context
4. Track opens and clicks

### Slack Integration

```n8n
After "Append to Google Sheets" node:
→ Slack node
→ Channel: #sales
→ Message: "New visitor enriched: {{ $json.name }} from {{ $json.company }}"
```

### Create Airtable Base

1. Replace Google Sheets with Airtable
2. Use same field mapping
3. Create views for analysis
4. Trigger automations on new records

## 🆘 Support & Resources

- **N8n Docs**: https://docs.n8n.io
- **Explorium API**: https://api.explorium.ai/docs
- **Chrome Extension API**: https://developer.chrome.com/docs/extensions/
- **LinkedIn**: https://linkedin.com/developers

## 🤝 Troubleshooting Checklist

Before reaching out for support:

- [ ] Verified webhook URL is correct
- [ ] Confirmed N8n instance is running
- [ ] Tested webhook in Postman or curl
- [ ] Checked browser console for errors (F12)
- [ ] Verified Google Sheet has correct headers
- [ ] Confirmed API credentials are valid
- [ ] Tested on a LinkedIn company page with visitors
- [ ] Checked n8n execution logs for errors
- [ ] Verified extension is enabled in browser
- [ ] Confirmed network/firewall allows connections

## 📞 Contact & Feedback

If you encounter issues:
1. Check the troubleshooting section above
2. Review n8n execution logs
3. Test webhook manually
4. Check API provider documentation
5. Verify all credentials are current

---

**Last Updated**: April 2026
**Version**: 1.0
**Status**: Production Ready
