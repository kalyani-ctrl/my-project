# Podcast Guest Compliance Checker

**Purpose**: Automated ICP fit analysis & background check for saas.group podcast guests

**Tech Stack**: Next.js 16, TypeScript, Tailwind CSS, Mock data layer

## Quick Setup

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page with form |
| `app/api/analyze-guest/route.ts` | Main API endpoint |
| `components/GuestComplianceForm.tsx` | Input form component |
| `components/ComplianceReportDisplay.tsx` | Report dashboard |
| `lib/scraper.ts` | Data collection (LinkedIn, news, etc.) |
| `lib/reportGenerator.ts` | ICP scoring & report generation |
| `types/index.ts` | TypeScript definitions |

## ICP Criteria (Customizable)

Located in `lib/reportGenerator.ts`:
- **ARR**: $1M–$20M (flexible for good stories)
- **Team Type**: Lean, profitable teams
- **Business Model**: SaaS, product-led, subscription
- **Geography**: US/Western Europe, EM-friendly
- **Reference**: Karel Papik, Ayush Chaturvedi, Devansh, Mark Walker (spirit, not checklist)

## Report Sections

Each analysis generates:
1. **Profile Overview**: Current role, experience, location
2. **Company Analysis**: Funding, stage, growth signals
3. **ICP Fit Scores** (5 dimensions):
   - Funding stage alignment (0–100)
   - Profitability alignment (0–100)
   - Product type alignment (0–100)
   - Geography alignment (0–100)
   - Online presence quality (0–100)
4. **Online Presence**: LinkedIn, Twitter, YouTube, blog, speaking
5. **Red Flags**: High/medium/low severity issues
6. **Recommendation**: Strong Fit / Good Fit / Consider / Pass + confidence %

## Current State

- ✅ Full UI/API working with mock data
- ✅ Type-safe report generation
- ✅ Responsive design (mobile-friendly)
- ⏳ Real data sources (Crunchbase, LinkedIn, NewsAPI) — ready for integration

## Next Steps (Optional Enhancements)

1. **Real Data Integration**:
   - LinkedIn API or Puppeteer scraper
   - Crunchbase API for company data
   - NewsAPI for recent news
   - Twitter/YouTube APIs for social signals

2. **Features**:
   - Batch upload (CSV of guests)
   - Save/export reports
   - Guest history tracking
   - Slack/email notifications

3. **Infrastructure**:
   - Database (PostgreSQL) for caching
   - Rate limiting on APIs
   - Error handling & retry logic

## Deployment

Deploy to Vercel for free:
```bash
vercel
```

Tool becomes instantly shareable with your team.

## Testing

```bash
curl -X POST http://localhost:3000/api/analyze-guest \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","company":"Acme SaaS","linkedinUrl":"https://linkedin.com/in/john"}'
```

## Common Customizations

### Change ICP thresholds:
```typescript
// lib/reportGenerator.ts
const ICP = {
  arrMin: 500_000,  // Lower ARR threshold
  arrMax: 50_000_000,  // Higher ARR threshold
  // ...
}
```

### Adjust red flag severity:
```typescript
// lib/reportGenerator.ts in identifyRedFlags()
// Modify severity levels or add new checks
```

### Update reference founders:
```typescript
// lib/reportGenerator.ts
referenceFounders: ['Your Guest 1', 'Your Guest 2'],
```

---

**Branch**: claude/podcast-guest-compliance-5x0dnf
