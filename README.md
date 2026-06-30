# Podcast Guest Compliance Checker

Automated background check & ICP fit analysis tool for vetting podcast guests. Built for saas.group podcast.

## Overview

This tool automates the process of evaluating podcast guest candidates by:
- Scraping public data from LinkedIn, news, company databases, and social media
- Analyzing fit against saas.group's ICP (Ideal Customer Profile)
- Generating detailed compliance reports with risk assessments and recommendations

## Key Features

### 🔍 Automated Data Collection
- **LinkedIn Profile Analysis**: Extract founder/founder experience, followers, engagement
- **Company Intelligence**: Funding stage, profitability signals, growth indicators
- **News & Signals**: Recent announcements, funding rounds, exits, controversies
- **Online Presence**: Twitter, YouTube, blog, speaking engagement tracking

### 🎯 ICP Fit Analysis
Evaluates candidates against saas.group's ideal guest profile:
- **Funding Stage**: $1M–$20M ARR sweet spot (flexible for good stories)
- **Team Type**: Lean, profitable teams (profitable > exact margin)
- **Business Model**: SaaS, product-led, subscription-based
- **Geography**: US/Western Europe focused, EM-friendly with strong narratives
- **Reference**: Similar spirit to Karel Papik, Ayush Chaturvedi, Devansh, Mark Walker
- **Flexibility**: Internal experts, post-acquisition operators, sector variety all welcome

### ⚠️ Red Flag Detection
- Negative news (bankruptcies, layoffs, controversies)
- Recent exits (may indicate unavailability)
- Limited online presence
- Profitability concerns
- Activity level indicators

### 📊 Comprehensive Reporting
Each report includes:
- Profile overview with LinkedIn metrics
- Company trajectory & funding signals
- Detailed ICP fit scores (0–100) across 5 dimensions
- Online presence quality assessment
- Flagged concerns with severity levels (high/medium/low)
- Confidence-weighted recommendation (Strong Fit / Good Fit / Consider / Pass)
- Suggested follow-up questions for outreach

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The tool features:
1. **Input Form**: Enter guest name, company, and optional LinkedIn URL
2. **Analysis**: System automatically scrapes and analyzes candidate
3. **Report**: View interactive dashboard with all findings

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Deploy to Vercel (Recommended)

Easiest way to share the tool with your team:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Your tool will get a shareable URL (e.g., `https://podcast-compliance.vercel.app`).

### Environment Variables

Currently uses mock data. To integrate real data sources, add `.env.local`:

```bash
# Optional future integrations
LINKEDIN_API_KEY=your_key
CRUNCHBASE_API_KEY=your_key
NEWS_API_KEY=your_key
```

## Architecture

### File Structure

```
app/
  ├── page.tsx                 # Home page
  ├── layout.tsx               # Root layout
  ├── globals.css              # Tailwind styles
  └── api/
      └── analyze-guest/
          └── route.ts         # Main API endpoint

components/
  ├── GuestComplianceForm.tsx  # Input form
  └── ComplianceReportDisplay.tsx # Report dashboard

lib/
  ├── scraper.ts              # Data collection (LinkedIn, news, etc.)
  └── reportGenerator.ts      # ICP scoring & report generation

types/
  └── index.ts                # TypeScript definitions
```

### How It Works

1. **User Input** → Form captures name, company, LinkedIn URL
2. **Scraping** → Parallel async calls to gather:
   - LinkedIn profile data
   - Company info (funding, stage, employees)
   - Recent news & press releases
   - Social media presence (Twitter, YouTube, blog)
3. **ICP Scoring** → Calculate fit across 5 dimensions:
   - Funding stage alignment
   - Profitability alignment
   - Product type alignment
   - Geography alignment
   - Online presence quality
4. **Risk Assessment** → Identify red flags (exits, negative news, etc.)
5. **Recommendation** → Generate confidence-weighted recommendation
6. **Report** → Interactive dashboard displays all findings

## Data Sources (Current & Future)

### Currently Implemented (Mock)
- Random but realistic data generation for demo

### Ready to Integrate
- **LinkedIn**: Official API or web scraping (Puppeteer)
- **Company Data**: Crunchbase, PitchBook, Clearbit APIs
- **News**: NewsAPI, Google News RSS, Press release aggregators
- **Social**: Twitter API, YouTube Data API
- **Verification**: Hunter.io for email validation

## ICP Customization

The ICP criteria are defined in `lib/reportGenerator.ts`:

```typescript
const ICP = {
  arrMin: 1_000_000,
  arrMax: 20_000_000,
  preferredGeographies: ['US', 'Western Europe', 'UK', 'Canada'],
  preferredBusinessModels: ['SaaS', 'Product-Led', 'Subscription'],
  preferredTeamType: 'Lean, profitable teams',
  referenceFounders: ['Karel Papik', 'Ayush Chaturvedi', 'Devansh', 'Mark Walker'],
};
```

Update these values to match your podcast's ideal guest profile.

## Example Workflow

1. **You**: "Let me check if Sarah from TechCorp is a good fit"
2. **Input**: Enter "Sarah Chen", "TechCorp", LinkedIn URL
3. **System**: Gathers public data automatically
4. **Report**: 
   - Overall ICP Score: 82/100 (Good Fit)
   - Company: Series A, $2.5M ARR estimated
   - Profile: 12K LinkedIn followers, active speaker
   - Recommendation: Good Fit (85% confidence)
   - Follow-up: Ask about recent funding usage, content plans
5. **Action**: Use recommendations to inform outreach

## Limitations & Notes

### Current State (MVP)
- Uses mock/simulated data (realistic patterns)
- Ready for real data source integration
- Basic scraping patterns established

### Next Steps
- Integrate real LinkedIn API or scraper
- Add Crunchbase API for company data
- Connect to news aggregators
- Implement email validation
- Add caching for repeated lookups
- Rate limiting for API calls

### Privacy & Compliance
- Respects `robots.txt` and terms of service
- Uses only publicly available data
- No sensitive information stored
- GDPR-friendly (no personal data retention)

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **Data**: Mock layer (ready for real integrations)
- **Deployment**: Vercel

## Contributing

To extend or improve the tool:

1. **Add data sources**: Expand `lib/scraper.ts`
2. **Customize ICP**: Modify `lib/reportGenerator.ts`
3. **Enhance UI**: Update components in `components/`
4. **Add features**: Create new API endpoints or pages

## Support

For questions or issues:
- Check the code comments for implementation details
- Review the ICP configuration in `reportGenerator.ts`
- Test with sample data to verify behavior

## License

Built for saas.group podcast guest vetting.
