# LinkedIn Post Enrichment Workflow

Automated n8n workflow to extract enriched profile data from LinkedIn post engagements (likes and comments).

## 📋 Features

- **LinkedIn Post URL Input**: Simply provide a LinkedIn post URL
- **Automatic Engagement Extraction**: Fetch all users who liked and commented
- **Profile Enrichment**: Enrich profiles with name, email, and workplace data
- **Google Sheets Integration**: Automatically store results in Google Sheets
- **Error Handling**: Graceful error handling and retry logic
- **Batch Processing**: Handle large volumes of engagements
- **Email Filtering**: Optional filtering for profiles with valid emails

## 🚀 Quick Start

### Step 1: Choose Your Workflow

Two workflow files are provided:

1. **Basic Workflow** (`linkedin-post-enrichment-workflow.json`)
   - Simple, straightforward data pipeline
   - Ideal for getting started
   - Minimal configuration

2. **Advanced Workflow** (`linkedin-post-enrichment-advanced.json`)
   - Input validation
   - Retry logic with exponential backoff
   - Detailed error handling
   - Email and no-email separate processing
   - Processing statistics
   - Recommended for production

### Step 2: Import Workflow

1. Open n8n
2. Click **Workflows** → **Import Workflow**
3. Select either workflow JSON file
4. Click **Import**

### Step 3: Configure Credentials

#### LinkedIn API Credentials
1. Choose your API service (see [API_CONFIGURATIONS.md](./API_CONFIGURATIONS.md))
2. Get your API key/token
3. In n8n: **Credentials** → **New** → **HTTP Header Auth**
4. Name it: `linkedin-api-credentials`
5. Add your API key

#### Google Sheets OAuth
1. In n8n: **Credentials** → **New** → **Google Sheets OAuth2**
2. Complete OAuth authorization
3. Name it: `google-sheets-credentials`

### Step 4: Configure Workflow

1. **Update API Endpoints**: Replace `YOUR_API_ENDPOINT` with your actual endpoint
2. **Update Google Sheets ID**: Set your target spreadsheet
3. **Add headers to Google Sheet**:
   ```
   Name | Email | Workplace | Title | Location | Profile ID | Timestamp
   ```

### Step 5: Test & Deploy

1. Click **Test** in n8n
2. Provide a LinkedIn post URL
3. Check Google Sheets for results
4. Save and activate workflow

## 📁 Files

| File | Purpose |
|------|---------|
| `linkedin-post-enrichment-workflow.json` | Basic workflow - recommended for learning |
| `linkedin-post-enrichment-advanced.json` | Production-ready with error handling |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `API_CONFIGURATIONS.md` | Specific configs for different API services |
| `README.md` | This file |

## 🔑 API Service Options

### Recommended: Phantom Buster
- Best for LinkedIn post engagement extraction
- Includes email discovery
- Free tier available
- [Setup Guide](./API_CONFIGURATIONS.md#phantom-buster-configuration)

### Alternative: RapidAPI LinkedIn Services
- Multiple LinkedIn APIs available
- Varying capabilities and costs
- [Setup Guide](./API_CONFIGURATIONS.md#rapidapi-linkedin-services)

### Advanced: Custom Backend
- If you have internal LinkedIn scraping
- Full control over data enrichment
- [Setup Guide](./API_CONFIGURATIONS.md#custom-implementation-example)

## 📊 Workflow Output

The workflow produces enriched profile data in Google Sheets:

```
Name          | Email              | Workplace    | Title            | Location        | Profile ID | Timestamp
--------------|------------------|--------------|------------------|-----------------|-----------|---------------------
John Doe      | john@company.com | Tech Corp    | Senior Engineer  | San Francisco   | usr123    | 2025-02-20T10:30:00Z
Jane Smith    | jane@startup.io  | Innovation   | Product Manager  | New York       | usr456    | 2025-02-20T10:30:05Z
```

## 🛠️ Configuration

### Input Format

The workflow accepts:
```json
{
  "linkedinPostUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7012345678910111213/"
}
```

### Required Fields

- `linkedinPostUrl` (string): Valid LinkedIn post URL

### Optional Fields

- `batchSize` (number): How many profiles to process in parallel (default: 100)
- `filterByEmail` (boolean): Only return profiles with emails (default: true)

## 📈 Advanced Features

### Error Handling
- Automatic retry with exponential backoff
- Handles API timeouts
- Logs detailed error messages
- Separates success/error data

### Data Validation
- Validates input URLs
- Handles missing fields gracefully
- Standardizes data format
- Timestamps all entries

### Email Filtering
- Optional email validation
- Separate sheets for profiles with/without emails
- Customizable filtering logic

### Statistics & Monitoring
- Tracks total profiles processed
- Counts profiles with/without emails
- Logs processing timeline
- Returns processing summary

## 🔒 Security

Best practices implemented:

- ✅ Credentials stored securely in n8n
- ✅ No hardcoded API keys
- ✅ HTTPS-only API calls
- ✅ OAuth 2.0 for Google Sheets
- ✅ Audit logging enabled

### Additional Security Recommendations

1. **Restrict Workflow Access**: Limit who can view/edit
2. **Archive Data**: Regular backups of enriched data
3. **Compliance**: Ensure GDPR/CCPA compliance
4. **Audit Trail**: Enable n8n audit logging
5. **Data Retention**: Set expiration policies

## 🐛 Troubleshooting

### Common Issues

**LinkedIn Post URL not recognized**
- Verify URL format: `https://www.linkedin.com/feed/update/urn:li:activity:.../`
- Check if post is public
- Ensure API has access

**No email addresses returned**
- Not all LinkedIn users have public emails
- Check if your API supports email extraction
- Try manual enrichment

**Google Sheets not updating**
- Verify OAuth token is fresh
- Check spreadsheet ID
- Ensure sheet name exists (usually "Sheet1")

**API Rate Limiting**
- Add delays between requests (1-2 seconds)
- Batch requests in smaller groups
- Check API rate limit status

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) for more troubleshooting tips.

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [API Configurations](./API_CONFIGURATIONS.md) - Specific API setup guides
- [n8n Documentation](https://docs.n8n.io) - n8n platform docs
- [LinkedIn API Docs](https://developers.linkedin.com) - Official LinkedIn API

## 💡 Usage Examples

### Single Post Enrichment
1. Get LinkedIn post URL
2. Paste into workflow trigger
3. Wait for processing
4. Check Google Sheets for results

### Batch Processing
1. Schedule workflow to run periodically
2. Or use workflow webhook for automation
3. Results accumulate in Google Sheets
4. Export data as needed

### Integration with Other Tools
- Connect Google Sheets to CRM (Salesforce, HubSpot)
- Export to email marketing (Mailchimp, ActiveCampaign)
- Sync with analytics (Google Analytics, Mixpanel)

## 🤝 Support

For issues or questions:

1. Check [Troubleshooting](./SETUP_GUIDE.md#troubleshooting)
2. Review [API Configurations](./API_CONFIGURATIONS.md)
3. Check n8n logs for error details
4. Consult API provider documentation

## 📝 Customization

### Add More Data Fields
1. Update API request to include more fields
2. Add columns to Google Sheets
3. Update mapping in workflow nodes

### Change Storage Backend
1. Replace Google Sheets node with:
   - Airtable
   - Database (PostgreSQL, MongoDB)
   - Webhook (send to external API)
   - Email/Slack notifications

### Add Post-Processing
1. Add nodes after data enrichment:
   - Email validation
   - Company verification
   - Duplicate detection
   - Data transformation

## 📄 License

This workflow is provided as-is for use with n8n.

## 📞 Need Help?

- n8n Community: https://community.n8n.io
- LinkedIn API Support: Check your API provider's documentation
- Google Sheets Help: https://support.google.com/sheets

---

**Last Updated**: February 2025
**Version**: 1.0
**Status**: Production Ready
