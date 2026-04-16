# Explorium API Configuration Guide

Complete guide for setting up Explorium API integration with your LinkedIn Visitor Enrichment workflow.

## 🚀 What is Explorium?

Explorium is a B2B data enrichment platform that:
- Finds email addresses from name + company
- Provides job titles, phone numbers, locations
- Includes firmographic data (company size, revenue, industry)
- Maintains high data accuracy
- Offers a generous free tier

**Website**: https://explorium.ai

## 📋 Prerequisites

- Explorium account (free or paid)
- API key from Explorium dashboard
- N8n instance with Explorium credentials configured

## 🔑 Getting Your Explorium API Key

### Step 1: Create Account

1. Go to https://explorium.ai
2. Click **Sign Up**
3. Enter email and password
4. Verify email address
5. Complete profile setup

### Step 2: Get API Key

1. Log into Explorium dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate New API Key**
4. Copy the key (looks like: `sk_live_abc123...`)
5. Save it securely

### Step 3: Check API Plan

1. Go to **Settings** → **Billing**
2. Note your current plan
3. Check API quota and usage
4. Free tier includes 100 enrichments/month

## 🔗 N8n Integration

### Create HTTP Header Auth Credentials

1. In N8n, go to **Credentials** → **New**
2. Search for and select **HTTP Header Auth**
3. Configure:
   ```
   Name: explorium-api-credentials
   Header Name: Authorization
   Header Value: Bearer YOUR_API_KEY
   ```
4. Click **Create**

### Update Workflow Node

In your workflow, the **"Enrich via Explorium"** node uses:

```json
{
  "url": "https://api.explorium.ai/enrich",
  "method": "POST",
  "authentication": "httpHeaderAuth",
  "genericCredentialType": "httpHeaderAuth",
  "sendBody": true,
  "bodyParametersJson": {
    "email": "{{ $json.email }}",
    "name": "{{ $json.name }}",
    "company": "{{ $json.company }}",
    "firstName": "{{ $json.firstName }}",
    "lastName": "{{ $json.lastName }}"
  }
}
```

## 📊 API Reference

### Endpoint

**POST** `https://api.explorium.ai/enrich`

### Authentication

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### Request Parameters

#### Required (at least one):
- `email` (string) - Email address
- `name` (string) - Full name
- `company` (string) - Company name

#### Optional:
- `firstName` (string) - First name
- `lastName` (string) - Last name
- `domain` (string) - Company domain
- `title` (string) - Job title
- `linkedinUrl` (string) - LinkedIn profile URL

### Response Format

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "email": "john.doe@google.com",
    "firstName": "John",
    "lastName": "Doe",
    "title": "Senior Software Engineer",
    "company": "Google",
    "industry": "Technology",
    "companySize": "10000+",
    "phone": "+1 (650) 253-0000",
    "address": "1600 Amphitheatre Parkway, Mountain View, CA 94043",
    "linkedinProfile": "john-doe",
    "linkedinConnections": 500,
    "yearsAtCompany": 3,
    "skills": [
      "Python",
      "Go",
      "Kubernetes",
      "Cloud Architecture"
    ],
    "workHistory": [
      {
        "title": "Senior Software Engineer",
        "company": "Google",
        "startDate": "2022-01-15",
        "endDate": null,
        "duration": "3 years"
      },
      {
        "title": "Software Engineer",
        "company": "Previous Company",
        "startDate": "2019-06-01",
        "endDate": "2021-12-31",
        "duration": "2.5 years"
      }
    ],
    "confidence": 0.95,
    "dataQuality": "high"
  }
}
```

**Error Response (4xx/5xx)**:
```json
{
  "success": false,
  "error": "No match found",
  "code": "NO_MATCH"
}
```

### Common Response Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | Success | Enrichment successful |
| 400 | Bad Request | Missing/invalid parameters |
| 401 | Unauthorized | Invalid API key |
| 402 | Payment Required | Out of credits |
| 404 | Not Found | No profile match found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Explorium server issue |

## 💰 Pricing & Quotas

### Free Plan
- 100 enrichments/month
- Email, title, company
- Basic industry data
- No phone numbers
- No direct API access

### Starter Plan ($99/month)
- 10,000 enrichments/month
- All basic fields
- Phone numbers
- Company demographics
- API access

### Professional Plan ($499/month)
- 100,000 enrichments/month
- All fields
- Historical data
- Custom fields
- Priority support

### Enterprise Plan (Custom)
- Unlimited enrichments
- Dedicated support
- Custom integrations
- SLA guarantee

## 🎯 Best Practices

### 1. Avoid Duplicate Enrichments

The N8n workflow already does this, but ensure:
- Check existing sheet before enriching
- Only enrich truly new profiles
- This saves significant API credits

**Example cost savings:**
- Without deduplication: 100 visitors × $0.50 = $50
- With deduplication: 20 new visitors × $0.50 = $10
- **Savings: $40 (80%)**

### 2. Optimize Request Data

Better match rates = better data:

```javascript
// ✅ GOOD: Provide complete info
{
  "email": "john.doe@google.com",
  "name": "John Doe",
  "company": "Google"
}

// ⚠️ OKAY: Some fields missing
{
  "name": "John Doe",
  "company": "Google"
}

// ❌ POOR: Insufficient info
{
  "name": "John"
}
```

### 3. Handle Errors Gracefully

In N8n, add error handling:

```json
{
  "maxRetries": 2,
  "retryWait": 1000,
  "continueOnError": true,
  "errorMessage": "Could not enrich profile"
}
```

### 4. Batch Processing

For better performance:
- Process 10-50 profiles in parallel
- Add delays between batches (2-3 seconds)
- Monitor rate limit usage

## 🔍 Testing Your Setup

### Test 1: Verify API Key

```bash
curl -X POST https://api.explorium.ai/enrich \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@google.com",
    "name": "Test User",
    "company": "Google"
  }'
```

### Test 2: N8n Webhook Test

1. Open N8n workflow
2. Click **"Enrich via Explorium"** node
3. Click **Test Step** button
4. Provide test data with email/name/company
5. Should see enriched response

### Test 3: Full Workflow Test

1. Go to LinkedIn company page
2. Capture a visitor
3. Send to N8n
4. Check Google Sheet after 30 seconds
5. Verify enriched fields appear

## 🐛 Common Issues & Solutions

### Issue: "401 Unauthorized"

**Cause**: API key is invalid or missing

**Solutions**:
1. Verify API key is correct (no extra spaces)
2. Check key hasn't expired
3. Generate new API key if unsure
4. Verify it's in N8n credentials

### Issue: "402 Payment Required"

**Cause**: Out of API quota

**Solutions**:
1. Check your plan limits
2. Reduce enrichment requests
3. Upgrade plan if needed
4. Set up alerts for quota usage
5. Delete old/duplicate records

### Issue: "404 No Match Found"

**Cause**: Explorium couldn't find the person

**Solutions**:
1. Verify name spelling is correct
2. Check company name is accurate
3. Include email if available
4. Try different name variations
5. Some profiles may not have public data

### Issue: "429 Too Many Requests"

**Cause**: Hitting rate limits

**Solutions**:
1. Add delays between requests (1-2 seconds)
2. Reduce batch size
3. Spread processing over time
4. Use queue/buffer strategy
5. Check rate limits in settings

### Issue: Enriched fields are empty/null

**Cause**: Explorium found person but missing data

**Solutions**:
1. Person's data may not be public
2. Add phone field to request
3. Provide LinkedIn URL if available
4. Try alternative email format
5. Check data quality field

## 📈 Monitoring & Optimization

### Check API Usage

1. Log into Explorium dashboard
2. Go to **Analytics** → **Usage**
3. View current month's consumption
4. Track cost per enrichment
5. Set budget alerts

### Optimize Your Workflow

**Current approach:**
```
LinkedIn visitors → Deduplicate → Enrich all → Save
Cost: 1 API call per new visitor
```

**Already optimized:**
✅ Deduplication prevents duplicate enrichments
✅ Only new visitors are enriched
✅ No wasted API credits

### Advanced Optimization

**Option 1: Selective Enrichment**
```
New visitor → Check confidence score
  → If email exists: enrich
  → If email missing: skip
Result: 50% fewer API calls
```

**Option 2: Batch Processing**
```
Collect 50 visitors → Deduplicate → Enrich batch
Result: Better price per enrichment
```

**Option 3: Data Validation**
```
Check LinkedIn → If verified: enrich
Result: Only enrich high-quality profiles
```

## 🔐 Security Considerations

### API Key Management

1. **Never commit API keys to git**
   - Use environment variables
   - Store in .env (never in .env.example)
   - Rotate keys quarterly

2. **Limit key permissions**
   - Use read-only keys if available
   - Don't share across teams
   - Create separate keys per environment

3. **Monitor key usage**
   - Check for unusual activity
   - Set up alerts
   - Rotate if compromised

### Data Privacy

1. **Comply with regulations**
   - GDPR: Get consent before enriching
   - CCPA: Honor opt-out requests
   - Local laws: Check requirements

2. **Handle data responsibly**
   - Don't store PII longer than needed
   - Archive sensitive data
   - Delete on request

## 📚 Further Resources

- **Explorium Documentation**: https://docs.explorium.ai
- **Explorium Blog**: https://explorium.ai/blog
- **Explorium Support**: https://support.explorium.ai
- **N8n Documentation**: https://docs.n8n.io

## 🔄 Integration Checklist

Before going live:

- [ ] Explorium account created and verified
- [ ] API key generated and secured
- [ ] N8n credentials configured
- [ ] Workflow node pointing to correct endpoint
- [ ] Test enrichment works in N8n
- [ ] Google Sheet headers match enriched fields
- [ ] Error handling configured
- [ ] Rate limiting set appropriately
- [ ] Cost monitoring set up
- [ ] Team trained on the system

## 📞 Support

**Having issues?**

1. Check API key in N8n credentials
2. Test endpoint with Postman/curl
3. Review N8n execution logs
4. Check Explorium account status
5. Verify API plan and quota
6. Contact Explorium support: https://support.explorium.ai

---

**Last Updated**: April 2026
**Version**: 1.0
**Explorium API Version**: v2
