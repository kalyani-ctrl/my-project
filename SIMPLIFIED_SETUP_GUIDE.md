# LinkedIn Visitor Enrichment - Simplified Setup

This is a **simplified version** of the workflow that fixes the credential/resource ID issues.

## Key Differences

✅ Uses **Google Sheets API** directly (no resource picker issues)
✅ No hardcoded resource IDs
✅ Simpler configuration
✅ Environment variable support for your Google Sheet ID

## Quick Start

### Step 1: Delete the Old Workflow

1. In N8n, open your current LinkedIn workflow
2. Click the **trash icon** (top right)
3. Confirm deletion

### Step 2: Import the Simplified Workflow

1. In N8n: **Workflows** → **Import Workflow**
2. Upload: `linkedin-visitor-enrichment-workflow-simplified.json`
3. Click **Import**

### Step 3: Create Credentials

**A) Google Sheets OAuth2**
1. **Credentials** → **New** → **Google Sheets OAuth2**
2. Complete OAuth flow
3. **Name it exactly**: `google-sheets-oauth2`
4. Save

**B) Explorium API**
1. **Credentials** → **New** → **HTTP Header Auth**
2. Fill in:
   - **Credential name**: `explorium-api-credentials`
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer YOUR_EXPLORIUM_API_KEY`
3. Save

### Step 4: Set Your Google Sheet ID

You have two options:

**Option A: Environment Variable (Recommended)**
1. Set environment variable: `GOOGLE_SHEET_ID=YOUR_SHEET_ID`
2. Replace `YOUR_SHEET_ID` with your actual ID
3. The workflow will use it automatically

**Option B: Manual Configuration**
1. Open the workflow
2. Click **"Get Existing Visitors from Sheet"** node
3. In the URL field, replace `{{ $env.GOOGLE_SHEET_ID }}` with your Sheet ID
4. Do the same for **"Append to Google Sheets"** node

### Step 5: Activate Webhook

1. Click **"Webhook - Chrome Extension"** node
2. Copy the **Webhook URL**
3. Save this for your Chrome extension configuration

### Step 6: Create Google Sheet

1. Create a new Google Sheet
2. Rename the first sheet to: `Visitors`
3. Add headers in row 1:
   ```
   profileId | name | email | headline | company | phone | address | industry | companySize | linkedinUrl | timestamp | enrichedAt | skills | workHistory
   ```

### Step 7: Activate & Test

1. Click **Save**
2. Toggle **Activate** to ON
3. Click **Execute Workflow** to test
4. Or capture visitors from Chrome extension

---

## How to Get Your Google Sheet ID

1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/[YOUR_ID_HERE]/edit
   ```
3. Copy the long ID between `/d/` and `/edit`
   - Example: `1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q`

---

## Troubleshooting

### "Invalid Google Sheet ID"
- Make sure your Sheet ID is correct (no extra spaces)
- Check the URL format in the node
- Verify the sheet name is `Visitors`

### "No output data" after running
- Check that your Google Sheet has the correct headers
- Verify OAuth credentials are active
- Check N8n execution logs for errors

### Webhook URL not working
- Make sure workflow is **Activated** (toggle ON)
- Verify webhook URL is correctly configured
- Check Chrome extension is sending to correct URL

---

## Credentials Checklist

Before testing, verify:
- ✅ `google-sheets-oauth2` credential created and authorized
- ✅ `explorium-api-credentials` created with valid API key
- ✅ Google Sheet ID set (either env var or in nodes)
- ✅ Google Sheet has `Visitors` sheet with headers
- ✅ Workflow is **Activated**

---

**This simplified version should work without the resource ID errors!**

If you still have issues, let me know what error message you're seeing.
