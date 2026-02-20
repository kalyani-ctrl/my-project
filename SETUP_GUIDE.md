# LinkedIn Post Enrichment Workflow - Setup Guide

## Overview

This n8n workflow automates the process of:
1. Taking a LinkedIn post URL as input
2. Fetching all users who liked and commented on that post
3. Enriching their profiles with data (name, email, workplace)
4. Storing the enriched data in Google Sheets or Airtable

## Workflow Architecture

```
LinkedIn Post URL Input
       ↓
Fetch Post Engagement (API Call)
       ↓
Parse Engagement Data
       ↓
Enrich Profile Data (API Call)
       ↓
Filter Profiles (optional - email validation)
       ↓
Store in Google Sheets/Airtable
       ↓
Success Response
```

## Prerequisites

- n8n instance (self-hosted or cloud)
- LinkedIn API credentials (choose one option below)
- Google Sheets account (for data export)
- API access to a LinkedIn engagement service

## LinkedIn API Options

### Option 1: Phantom Buster (Recommended)

Phantom Buster offers LinkedIn post scraping with engagement data.

**Setup Steps:**
1. Create account at https://phantombuster.com
2. Create an API key in your dashboard
3. Use endpoint: `https://api.phantombuster.com/api/v2/PhantomBuster`
4. Required parameters:
   - `action`: "launch"
   - `botId`: The LinkedIn Post Scraper bot ID
   - `arguments`: `{"postUrl": "YOUR_POST_URL", "emailFormat": "full"}`

**Pros:**
- Designed specifically for LinkedIn post engagement
- Includes email discovery
- Reliable engagement data

### Option 2: RapidAPI LinkedIn Services

Several LinkedIn services available on RapidAPI.

**Popular Options:**
- LinkedIn Data API (Scrapermaven)
- LinkedIn Profile Data by Apify
- LinkedIn Page Data

**Setup:**
1. Get RapidAPI key at https://rapidapi.com
2. Subscribe to a LinkedIn service
3. Use their provided endpoints
4. Add API key to n8n credentials

### Option 3: LinkedIn Official API

LinkedIn provides official Graph API (limited engagement data).

**Setup:**
1. Register developer app at https://www.linkedin.com/developers
2. Get access token via OAuth 2.0
3. Use endpoints under `/v2/me` and related paths
4. Note: Official API has limitations on engagement data access

**Limitations:**
- Can't directly fetch "likers" data
- Limited public profile information
- Requires user authentication

### Option 4: Custom Web Scraping

If using n8n with Puppeteer node.

**Setup:**
1. Use n8n's Puppeteer node
2. Script to:
   - Navigate to LinkedIn post URL
   - Scroll to load comments/likes
   - Extract profile URLs
   - Call enrichment API for each profile

**Cons:**
- More complex
- May violate LinkedIn ToS
- Slower performance

---

## Installation Steps

### Step 1: Create n8n Credentials

#### LinkedIn API Credentials

1. In n8n, go to **Credentials** → **New**
2. Select **Header Auth** or **API Key Auth**
3. Add your API credentials:
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

#### Google Sheets OAuth

1. In n8n, go to **Credentials** → **New**
2. Select **Google Sheets OAuth2**
3. Follow OAuth flow
4. Authorize n8n to access your Google Sheets

### Step 2: Import Workflow

1. Download `linkedin-post-enrichment-workflow.json`
2. In n8n: **Workflows** → **Import Workflow**
3. Upload the JSON file
4. Click **Import**

### Step 3: Update API Endpoints

Edit the workflow nodes:

**Node: "Fetch Post Engagement"**
- Replace `YOUR_API_ENDPOINT/engagement` with your actual API endpoint
- Update `bodyParametersJson` if your API requires different parameters

**Node: "Enrich Profile Data"**
- Replace `YOUR_API_ENDPOINT/profile/enrich` with your enrichment endpoint
- Adjust the fields based on what your API provides

### Step 4: Configure Google Sheets

1. Create a new Google Sheet
2. Add headers in the first row:
   ```
   Name | Email | Workplace | Title | Location | Timestamp
   ```

3. In the workflow, update **"Append to Google Sheets"** node:
   - Select your spreadsheet from the dropdown
   - Verify the range is correct (e.g., "Sheet1!A:F")

### Step 5: Test the Workflow

1. Click **Test**
2. Provide a test LinkedIn post URL:
   ```
   https://www.linkedin.com/feed/update/urn:li:activity:7012345678910111213/
   ```
3. Check Google Sheets for results

---

## Input Format

The workflow expects a trigger with this data structure:

```json
{
  "linkedinPostUrl": "https://www.linkedin.com/feed/update/urn:li:activity:XXXXX/"
}
```

## Output Format

Each enriched profile is added to Google Sheets with:
- **Name**: Full name of the user
- **Email**: Email address (if available)
- **Workplace**: Current company/workplace
- **Title**: Job title/headline
- **Location**: Geographic location
- **Timestamp**: When the data was added

## API Request/Response Examples

### Example: Phantom Buster Engagement API

**Request:**
```bash
curl -X POST https://api.phantombuster.com/api/v2/PhantomBuster \
  -H "X-Phantombuster-Key: YOUR_API_KEY" \
  -d '{
    "action": "launch",
    "botId": "2391",
    "arguments": {
      "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:XXX/",
      "emailFormat": "full"
    }
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "engagements": [
      {
        "type": "like",
        "profileId": "ABC123",
        "name": "John Doe",
        "email": "john@example.com",
        "company": "Tech Corp",
        "headline": "Software Engineer"
      }
    ]
  }
}
```

### Example: Custom Enrichment API

**Request:**
```bash
POST https://your-api.com/profile/enrich
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "profile_id": "ABC123",
  "fields": ["name", "email", "workplace", "title"]
}
```

**Response:**
```json
{
  "profile_id": "ABC123",
  "name": "John Doe",
  "email": "john@example.com",
  "workplace": "Tech Corp",
  "title": "Software Engineer",
  "location": "San Francisco, CA"
}
```

---

## Workflow Customization

### Remove Email Filter

If you want all profiles (even without email):
1. Delete the **"Filter - Only Profiles with Email"** node
2. Connect **"Enrich Profile Data"** directly to **"Append to Google Sheets"**

### Add Additional Fields

To capture more data:
1. Edit **"Enrich Profile Data"** node
2. Add fields to the `fields` array:
   ```json
   "fields": ["name", "email", "workplace", "title", "skills", "connections"]
   ```
3. Update Google Sheets headers and columns
4. Update the **"Append to Google Sheets"** values formula

### Switch to Airtable

Instead of Google Sheets:
1. Replace the **"Append to Google Sheets"** node
2. Add **Airtable** node
3. Configure with your Airtable base and table
4. Map the same fields

### Add Email Validation

To verify emails before storing:
1. Add **Email Validator** node between enrichment and storage
2. Only pass valid emails to Google Sheets

---

## Error Handling

The workflow includes basic error handling. To enhance:

1. Add **Error Handler** nodes for each API call
2. Implement retry logic:
   - Set max retries: 3
   - Add exponential backoff (1s → 2s → 4s)
3. Log errors to a separate sheet
4. Send notifications on failures

---

## Rate Limiting

Most APIs have rate limits. To handle:

1. Add **Wait** node between requests (1-2 seconds)
2. Batch requests in smaller chunks
3. Implement request queuing for large workflows
4. Monitor API usage in your dashboard

---

## Security Best Practices

1. **Never hardcode credentials** - Use n8n credentials
2. **Secure API keys** - Store in environment variables
3. **HTTPS only** - Ensure all API calls use HTTPS
4. **Limit data retention** - Archive old sheets regularly
5. **Audit access** - Monitor who can run this workflow
6. **Data privacy** - Comply with GDPR/CCPA for email data

---

## Troubleshooting

### Issue: "Engagement data not found"
- Verify LinkedIn post URL is valid
- Check if post is public
- Ensure API has access to post

### Issue: "Email field is null"
- Not all profiles have public emails
- Your API may not support email discovery
- Check API documentation for email extraction

### Issue: "Google Sheets not updating"
- Verify OAuth credentials are active
- Check spreadsheet ID is correct
- Ensure sheet name matches (usually "Sheet1")

### Issue: "API returns 401 Unauthorized"
- Check API key/token is valid
- Verify credentials are correctly configured in n8n
- Check API key expiration date

---

## Support & Resources

- n8n Documentation: https://docs.n8n.io
- Phantom Buster: https://phantombuster.com/docs
- RapidAPI LinkedIn APIs: https://rapidapi.com/search/linkedin
- LinkedIn Official API: https://developers.linkedin.com

