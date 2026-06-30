import { GuestData, ComplianceReport, RedFlag } from '@/types';

interface ScrapedData {
  linkedinProfile?: any;
  companyInfo?: any;
  onlinePresence?: any;
  newsHeadlines?: string[];
  socialSignals?: any;
}

const ICP = {
  arrMin: 1_000_000,
  arrMax: 20_000_000,
  preferredGeographies: ['US', 'Western Europe', 'UK', 'Canada'],
  preferredBusinessModels: ['SaaS', 'Product-Led', 'Subscription'],
  preferredTeamType: 'Lean, profitable teams',
  referenceFounders: ['Karel Papik', 'Ayush Chaturvedi', 'Devansh', 'Mark Walker'],
};

export async function generateComplianceReport(
  guestData: GuestData,
  scrapedData: ScrapedData
): Promise<ComplianceReport> {
  const linkedinProfile = scrapedData.linkedinProfile || {};
  const companyInfo = scrapedData.companyInfo || {};
  const onlinePresence = scrapedData.onlinePresence || {};

  const icpAnalysis = calculateICPFit(linkedinProfile, companyInfo);
  const redFlags = identifyRedFlags(linkedinProfile, companyInfo, scrapedData.newsHeadlines || []);
  const recommendation = generateRecommendation(icpAnalysis, redFlags, linkedinProfile, companyInfo);

  return {
    guestName: guestData.name,
    company: guestData.company,
    generatedAt: new Date().toISOString(),

    profileOverview: {
      currentRole: linkedinProfile.recentPosition?.title || 'Founder/Leader',
      experience: linkedinProfile.positionsCount ? `${linkedinProfile.positionsCount}+ roles` : 'Multiple roles',
      location: linkedinProfile.location || 'Not specified',
      linkedinData: linkedinProfile,
    },

    companyAnalysis: {
      profile: companyInfo,
      signals: {
        fundingStage: companyInfo.publicSignals?.fundingStage || 'Unknown',
        profitabilityIndicators: getProfitabilitySignals(companyInfo),
        growthSignals: getGrowthSignals(companyInfo),
        newsHeadlines: (scrapedData.newsHeadlines || []).slice(0, 5),
      },
    },

    onlinePresence: {
      ...onlinePresence,
      qualityAssessment: assessOnlinePresenceQuality(onlinePresence),
    },

    icpFitAnalysis: icpAnalysis,

    redFlags,

    recommendation,
  };
}

function calculateICPFit(linkedinProfile: any, companyInfo: any) {
  const estimatedARR = estimateARR(companyInfo);

  const stageAlignment = {
    score: calculateStageScore(companyInfo, estimatedARR),
    details: `${companyInfo.publicSignals?.fundingStage || 'Unknown'} stage company${estimatedARR ? ` with estimated ${estimatedARR} ARR` : ''}`,
  };

  const profitabilityAlignment = {
    score: calculateProfitabilityScore(companyInfo),
    details: companyInfo.publicSignals?.fundingStage === 'Bootstrapped'
      ? 'Bootstrapped & profitable - strong alignment'
      : companyInfo.publicSignals?.fundingStage?.includes('Series')
        ? 'Funded but growth-focused - moderate alignment'
        : 'Early stage - consider profitability trajectory',
  };

  const productTypeAlignment = {
    score: calculateProductTypeScore(companyInfo),
    details: `${companyInfo.industry || 'Software'} company aligns with product-led SaaS preference`,
  };

  const geographyAlignment = {
    score: isUS_WesternEuropean(linkedinProfile.location) ? 85 : 65,
    details: `${linkedinProfile.location || 'Location unknown'} - ${
      isUS_WesternEuropean(linkedinProfile.location) ? 'Primary target geography' : 'EM/Secondary geography'
    }`,
  };

  const presenceQualityScore = {
    score: calculatePresenceQuality(linkedinProfile),
    details: `LinkedIn following: ${linkedinProfile.followers?.toLocaleString() || '?'}, Speaking experience evident`,
  };

  const overallICPScore = Math.round(
    (stageAlignment.score * 0.25 +
      profitabilityAlignment.score * 0.25 +
      productTypeAlignment.score * 0.2 +
      geographyAlignment.score * 0.15 +
      presenceQualityScore.score * 0.15) /
      100
  ) * 100;

  return {
    stageAlignment,
    profitabilityAlignment,
    productTypeAlignment,
    geographyAlignment,
    presenceQualityScore,
    overallICPScore,
  };
}

function calculateStageScore(companyInfo: any, estimatedARR: string | null): number {
  const stage = companyInfo.publicSignals?.fundingStage;

  if (!stage) return 50;
  if (stage === 'Bootstrapped') return 95;
  if (stage.includes('Series A') || stage.includes('Series B')) return 90;
  if (stage.includes('Series C') || stage.includes('Series D')) return 70;
  if (stage.includes('Seed')) return 85;
  if (stage.includes('Growth')) return 65;

  return 60;
}

function calculateProfitabilityScore(companyInfo: any): number {
  const stage = companyInfo.publicSignals?.fundingStage;
  if (stage === 'Bootstrapped') return 95;
  if (stage?.includes('Series')) {
    const seriesNum = parseInt(stage.match(/\d/)?.[0] || '0');
    return 80 - seriesNum * 10;
  }
  return 50;
}

function calculateProductTypeScore(companyInfo: any): number {
  const industry = (companyInfo.industry || '').toLowerCase();
  const preferredIndustries = ['saas', 'devtools', 'martech', 'api', 'fintech'];

  if (preferredIndustries.some(ind => industry.includes(ind))) return 85;
  return 60;
}

function calculatePresenceQuality(linkedinProfile: any): number {
  let score = 50;

  if (linkedinProfile.followers && linkedinProfile.followers > 10000) score += 20;
  else if (linkedinProfile.followers && linkedinProfile.followers > 5000) score += 15;
  else if (linkedinProfile.followers && linkedinProfile.followers > 1000) score += 10;

  if (linkedinProfile.positionsCount && linkedinProfile.positionsCount > 3) score += 15;
  else if (linkedinProfile.positionsCount) score += 10;

  return Math.min(score, 100);
}

function isUS_WesternEuropean(location: string | undefined): boolean {
  if (!location) return true;

  const text = location.toLowerCase();
  const regions = ['us', 'usa', 'san francisco', 'new york', 'california', 'uk', 'europe', 'london', 'berlin', 'paris', 'amsterdam', 'canada'];

  return regions.some(region => text.includes(region));
}

function estimateARR(companyInfo: any): string | null {
  const stage = companyInfo.publicSignals?.fundingStage;
  const totalRaised = companyInfo.funding?.totalRaised;

  if (stage === 'Bootstrapped') return 'Profitable (Bootstrapped)';
  if (totalRaised && totalRaised.includes('$')) {
    const amount = parseInt(totalRaised.match(/\d+/)?.[0] || '0');
    if (amount > 10) return '$5M-$20M (estimated)';
    if (amount > 5) return '$2M-$10M (estimated)';
    return '$1M-$5M (estimated)';
  }

  return null;
}

function getProfitabilitySignals(companyInfo: any): string[] {
  const signals: string[] = [];

  if (companyInfo.publicSignals?.fundingStage === 'Bootstrapped') {
    signals.push('Bootstrapped - indicates profitability or sustainability');
  }

  if (companyInfo.publicSignals?.isHiring) {
    signals.push('Currently hiring - growth signal');
  }

  if (companyInfo.publicSignals?.recentNews?.some((n: string) => n.includes('profitable'))) {
    signals.push('Recent profitability announcement');
  }

  if (!signals.length) {
    signals.push('Growth-stage focus - may be optimizing for scale over profitability');
  }

  return signals;
}

function getGrowthSignals(companyInfo: any): string[] {
  const signals: string[] = [];

  if (companyInfo.publicSignals?.fundingStage?.includes('Series')) {
    signals.push(`${companyInfo.publicSignals.fundingStage} funding indicates growth trajectory`);
  }

  if (companyInfo.publicSignals?.isHiring) {
    signals.push('Active hiring - indicates expansion');
  }

  companyInfo.publicSignals?.recentNews?.slice(0, 2).forEach((news: string) => {
    if (news.includes('expands') || news.includes('launch') || news.includes('acquires')) {
      signals.push(news);
    }
  });

  return signals;
}

function assessOnlinePresenceQuality(onlinePresence: any): string {
  const hasLinkedIn = onlinePresence.linkedinFollowers && onlinePresence.linkedinFollowers > 1000;
  const hasTwitter = onlinePresence.twitterFollowers && onlinePresence.twitterFollowers > 500;
  const hasYouTube = onlinePresence.youtubePresence;
  const hasBlog = onlinePresence.blogPresence;
  const speakingEngagements = onlinePresence.speakingEngagements || 0;

  const activeChannels = [hasLinkedIn, hasTwitter, hasYouTube, hasBlog].filter(Boolean).length;

  if (activeChannels >= 3 && speakingEngagements > 5) {
    return 'Strong online presence with diverse content distribution and speaking experience.';
  }
  if (activeChannels >= 2 && speakingEngagements > 2) {
    return 'Good online presence across multiple channels with some speaking experience.';
  }
  if (activeChannels >= 1 || speakingEngagements > 1) {
    return 'Moderate online presence; primarily active on LinkedIn with limited additional channels.';
  }
  return 'Limited online presence detected. Consider asking about content/speaking plans.';
}

function identifyRedFlags(linkedinProfile: any, companyInfo: any, newsHeadlines: string[]): RedFlag[] {
  const flags: RedFlag[] = [];

  if (!linkedinProfile.name) {
    flags.push({
      severity: 'medium',
      title: 'LinkedIn profile not accessible',
      description: 'Could not retrieve LinkedIn data. May indicate private profile or non-existent profile.',
    });
  }

  if (companyInfo.publicSignals?.hasExited) {
    flags.push({
      severity: 'low',
      title: 'Company appears to have exited',
      description: 'Public signals indicate a company acquisition or exit. Guest may be unavailable or less focused.',
    });
  }

  if (newsHeadlines.some(h => h.toLowerCase().includes('bankruptcy') || h.toLowerCase().includes('layoff'))) {
    flags.push({
      severity: 'high',
      title: 'Negative news detected',
      description: 'Recent news suggests company challenges. Verify current status before outreach.',
    });
  }

  if (!companyInfo.publicSignals?.isHiring) {
    flags.push({
      severity: 'low',
      title: 'Not actively hiring',
      description: 'May indicate slower growth or maturity phase. Context matters.',
    });
  }

  if (!linkedinProfile.followers || linkedinProfile.followers < 500) {
    flags.push({
      severity: 'low',
      title: 'Limited LinkedIn following',
      description: 'Guest has <500 followers on LinkedIn. Consider online presence expectations.',
    });
  }

  return flags;
}

function generateRecommendation(icpAnalysis: any, redFlags: RedFlag[], linkedinProfile: any, companyInfo: any) {
  const icpScore = icpAnalysis.overallICPScore;
  const highSeverityFlags = redFlags.filter(f => f.severity === 'high').length;

  let status: 'strong-fit' | 'good-fit' | 'consider' | 'pass' = 'consider';
  let confidence = 0;

  if (highSeverityFlags > 0) {
    status = 'pass';
    confidence = 0.3;
  } else if (icpScore >= 80) {
    status = 'strong-fit';
    confidence = 0.95;
  } else if (icpScore >= 65) {
    status = 'good-fit';
    confidence = 0.85;
  } else if (icpScore >= 50) {
    status = 'consider';
    confidence = 0.65;
  } else {
    status = 'pass';
    confidence = 0.4;
  }

  const reasoning: string[] = [];

  if (icpScore >= 70) {
    reasoning.push(`Strong ICP alignment with score of ${icpScore}/100`);
  } else if (icpScore >= 50) {
    reasoning.push(`Moderate ICP alignment with score of ${icpScore}/100`);
  } else {
    reasoning.push(`Limited ICP alignment with score of ${icpScore}/100`);
  }

  if (companyInfo.publicSignals?.fundingStage === 'Bootstrapped') {
    reasoning.push('Bootstrapped company aligns with preference for lean, profitable teams');
  }

  if (linkedinProfile.followers && linkedinProfile.followers > 10000) {
    reasoning.push('Strong personal brand and online presence');
  }

  if (redFlags.length > 0) {
    reasoning.push(`${redFlags.length} flag(s) to review before outreach`);
  }

  const suggestedFollowUp: string[] = [];

  if (icpScore < 70) {
    suggestedFollowUp.push('Ask about current metrics: ARR, profitability, team size');
    suggestedFollowUp.push('Understand unique angle - what makes their story compelling?');
  }

  if (linkedinProfile.followers && linkedinProfile.followers < 5000) {
    suggestedFollowUp.push('Ask about other content distribution channels (Twitter, blog, podcasts)');
  }

  if (!companyInfo.publicSignals?.isHiring) {
    suggestedFollowUp.push('Ask about company growth stage and current focus');
  }

  suggestedFollowUp.push('Confirm timezone and availability for recording session');

  return {
    status,
    confidence,
    reasoning,
    suggestedFollowUp,
  };
}
