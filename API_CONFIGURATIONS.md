# LinkedIn API Configurations

This document provides specific configuration examples for different LinkedIn API services.

## Table of Contents
1. [Phantom Buster Configuration](#phantom-buster-configuration)
2. [RapidAPI LinkedIn Services](#rapidapi-linkedin-services)
3. [LinkedIn Official Graph API](#linkedin-official-graph-api)
4. [Custom Implementation Example](#custom-implementation-example)

---

## Phantom Buster Configuration

### Why Phantom Buster?
- Specifically designed for LinkedIn post scraping
- Automatically extracts likers and commenters
- Includes email discovery capabilities
- Reliable with minimal detection

### Setup

**1. Create Account & Get API Key**
```
Website: https://phantombuster.com
1. Sign up for a free account
2. Go to Dashboard → Settings
3. Copy your API Key
4. Note your Agent IDs for specific tasks
```

**2. LinkedIn Post Scraper Bot Details**
```
Bot ID: 2391
Agent ID: LinkedinPostScraperBot
```

**3. n8n Node Configuration**

Node: "Fetch Post Engagement"

```json
{
  "method": "POST",
  "url": "https://api.phantombuster.com/api/v2/PhantomBuster",
  "headers": {
    "X-Phantombuster-Key": "{{ $credentials.phantombusterApiKey }}"
  },
  "body": {
    "action": "launch",
    "botId": "2391",
    "arguments": {
      "postUrl": "{{ $node['Start - LinkedIn Post URL'].json.linkedinPostUrl }}",
      "emailFormat": "full"
    },
    "jsonReturned": true
  }
}
```

**4. Response Handling**

Phantom Buster returns data in this format:
```json
{
  "status": "success",
  "data": {
    "engagements": [
      {
        "type": "like",
        "profileUrl": "https://www.linkedin.com/in/john-doe/",
        "name": "John Doe",
        "headline": "Software Engineer at Tech Corp",
        "email": "john@example.com",
        "publicIdentifier": "john-doe"
      },
      {
        "type": "comment",
        "profileUrl": "https://www.linkedin.com/in/jane-smith/",
        "name": "Jane Smith",
        "headline": "Product Manager",
        "email": null,
        "publicIdentifier": "jane-smith"
      }
    ]
  }
}
```

**5. n8n Enrichment Node**

For Phantom Buster, you can use their enrichment endpoint or skip to direct storage since engagement data includes most fields needed.

```json
{
  "operation": "map",
  "mappingDefinition": {
    "sourceKeys": [
      { "key": "name", "type": "string" },
      { "key": "email", "type": "string" },
      { "key": "headline", "type": "string" },
      { "key": "type", "type": "string" }
    ]
  }
}
```

**6. Google Sheets Mapping**

```json
{
  "values": [
    {
      "name": "{{ $json.name }}",
      "email": "{{ $json.email || 'N/A' }}",
      "workplace": "{{ $json.headline.split(' at ')[1] || 'Unknown' }}",
      "title": "{{ $json.headline.split(' at ')[0] || $json.headline }}",
      "engagement_type": "{{ $json.type }}"
    }
  ]
}
```

**7. Credentials Setup in n8n**

1. Go to Credentials → New
2. Type: HTTP Header Auth
3. Name: `phantombuster-api`
4. Header Name: `X-Phantombuster-Key`
5. Header Value: `{{ YOUR_API_KEY }}`
6. Save

---

## RapidAPI LinkedIn Services

### Popular LinkedIn APIs on RapidAPI

#### Option A: LinkedIn Profile Scraper

**Service**: linkedin-api by goburhan

**Base URL**: `https://linkedin-api1.p.rapidapi.com`

**Authentication**:
```
X-RapidAPI-Key: YOUR_RAPIDAPI_KEY
X-RapidAPI-Host: linkedin-api1.p.rapidapi.com
```

**Endpoints**:

Get profile by username:
```bash
GET /get-profile-by-username?username=john-doe
```

Get profile posts:
```bash
GET /get-profile-posts?id=PROFILE_ID
```

Get post details with engagement:
```bash
GET /get-post-details?postId=POST_ID&includeEngagement=true
```

**n8n Configuration**:

```json
{
  "method": "GET",
  "url": "https://linkedin-api1.p.rapidapi.com/get-post-details",
  "headers": {
    "X-RapidAPI-Key": "{{ $credentials.rapidApiKey }}",
    "X-RapidAPI-Host": "linkedin-api1.p.rapidapi.com"
  },
  "qs": {
    "postId": "{{ $node['Parse LinkedIn URL'].json.postId }}",
    "includeEngagement": "true"
  }
}
```

#### Option B: Apify LinkedIn Data

**Service**: LinkedIn Data by Apify

**Setup**:
```
1. Go to https://apify.com
2. Subscribe to LinkedIn Post Scraper
3. Get your API token
4. Create task configuration
```

**n8n Configuration**:

```json
{
  "method": "POST",
  "url": "https://api.apify.com/v2/acts/apify~linkedin-post-scraper/run-sync-get-dataset-items",
  "headers": {
    "Authorization": "Bearer {{ $credentials.apifyApiToken }}"
  },
  "body": {
    "postUrls": ["{{ $node['Start - LinkedIn Post URL'].json.linkedinPostUrl }}"]
  }
}
```

---

## LinkedIn Official Graph API

### Setup

**1. Register Developer Application**
```
1. Go to https://www.linkedin.com/developers
2. Create a new app
3. Get your Client ID and Client Secret
4. Add redirect URI
```

**2. OAuth 2.0 Flow in n8n**

Create OAuth2 credentials:
- Name: linkedin-oauth
- Grant Type: Authorization Code
- Authorization URL: `https://www.linkedin.com/oauth/v2/authorization`
- Access Token URL: `https://www.linkedin.com/oauth/v2/accessToken`
- Client ID: `{{ YOUR_CLIENT_ID }}`
- Client Secret: `{{ YOUR_CLIENT_SECRET }}`
- Scope: `r_basicprofile r_emailaddress w_member_social`

**3. Get Current User Profile**

```json
{
  "method": "GET",
  "url": "https://api.linkedin.com/v2/me",
  "headers": {
    "Authorization": "Bearer {{ $credentials.accessToken }}",
    "Content-Type": "application/json"
  }
}
```

**4. Search for Profiles**

```json
{
  "method": "GET",
  "url": "https://api.linkedin.com/v2/search",
  "qs": {
    "q": "companies",
    "count": 10
  },
  "headers": {
    "Authorization": "Bearer {{ $credentials.accessToken }}"
  }
}
```

**Important Limitations**:
- Official API **cannot fetch post likers directly**
- Limited profile visibility
- No email extraction capability
- Requires user-level OAuth
- Rate limited

⚠️ **Note**: LinkedIn's official API is very restrictive for engagement data. For this use case, Phantom Buster or RapidAPI services are better alternatives.

---

## Custom Implementation Example

### Using LinkedIn Unofficial Data API (Advanced)

If using a custom backend service that scrapes LinkedIn:

**Node: Fetch Post Engagement**

```json
{
  "method": "POST",
  "url": "https://your-backend.com/linkedin/post/engagement",
  "authentication": "bearer",
  "credentials": "your-backend-api",
  "body": {
    "postUrl": "{{ $node['Start - LinkedIn Post URL'].json.linkedinPostUrl }}",
    "extractEmails": true,
    "fields": ["name", "email", "workplace", "title", "location"]
  }
}
```

**Expected Response**:

```json
{
  "success": true,
  "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:...",
  "totalEngagements": 150,
  "data": {
    "likes": [
      {
        "id": "user123",
        "name": "John Doe",
        "email": "john@company.com",
        "title": "Senior Engineer",
        "workplace": "Tech Corp",
        "location": "San Francisco"
      }
    ],
    "comments": [
      {
        "id": "user456",
        "name": "Jane Smith",
        "email": null,
        "title": "Product Lead",
        "workplace": "Innovation Inc",
        "location": "New York"
      }
    ]
  }
}
```

**n8n Processing**:

```javascript
// In Code node
return items.map(item => {
  const engagements = [
    ...(item.json.data.likes || []),
    ...(item.json.data.comments || [])
  ];

  return {
    json: {
      engagements: engagements
    }
  };
});
```

---

## Comparison Table

| Feature | Phantom Buster | RapidAPI LinkedIn | Official LinkedIn API | Custom |
|---------|---|---|---|---|
| **Setup Difficulty** | Easy | Medium | Hard | Hard |
| **Cost** | Free tier available | $1-100/mo | Free (limited) | Varies |
| **Post Engagement** | ✅ Yes | ⚠️ Limited | ❌ No | ✅ Yes |
| **Email Extraction** | ✅ Yes | ⚠️ Some APIs | ❌ No | ✅ Yes |
| **Rate Limits** | Generous | Strict | Strict | Custom |
| **Reliability** | High | Medium | High | Custom |
| **Support** | Good | Limited | Official | Own |
| **Learning Curve** | Low | Low | High | High |

---

## Recommended Setup for Your Use Case

Based on requirements (name, email, workplace):

### Best Option: **Phantom Buster**
- Easiest setup
- Includes email discovery
- Reliable engagement data
- Good free tier

### Alternative: **Custom Enrichment API**
- If you have internal LinkedIn scraping
- More control over data
- No API costs
- Higher maintenance

---

## Testing Your API Configuration

Before deploying to production:

### 1. Test API Directly

```bash
# Test Phantom Buster
curl -X POST https://api.phantombuster.com/api/v2/PhantomBuster \
  -H "X-Phantombuster-Key: YOUR_KEY" \
  -d '{
    "action": "launch",
    "botId": "2391",
    "arguments": {
      "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7012345678910111213/"
    }
  }' | jq
```

### 2. Test in n8n Sandbox

1. Create test nodes with hardcoded values
2. Run workflow with test data
3. Verify output format
4. Check Google Sheets integration

### 3. Monitor API Responses

Log API responses to identify issues:
- Missing fields
- Data format mismatches
- Rate limiting
- Authentication errors

