export interface GuestData {
  name: string;
  company: string;
  linkedinUrl?: string;
}

export interface LinkedInProfile {
  name?: string;
  headline?: string;
  location?: string;
  followers?: number;
  connections?: number;
  aboutSection?: string;
  positionsCount?: number;
  recentPosition?: {
    title?: string;
    company?: string;
    duration?: string;
  };
}

export interface CompanyInfo {
  name: string;
  industry?: string;
  size?: string;
  founded?: number;
  location?: string;
  website?: string;
  description?: string;
  funding?: {
    stage?: string;
    totalRaised?: string;
    lastRound?: string;
  };
  employees?: number;
  publicSignals?: {
    hasExited?: boolean;
    fundingStage?: string;
    isHiring?: boolean;
    recentNews?: string[];
  };
}

export interface OnlinePresence {
  linkedinFollowers?: number;
  twitterFollowers?: number;
  youtubePresence?: boolean;
  youtubeSubscribers?: number;
  blogPresence?: boolean;
  speakingEngagements?: number;
  contentQualityScore?: number;
}

export interface ICPFitAnalysis {
  stageAlignment: {
    score: number;
    details: string;
  };
  profitabilityAlignment: {
    score: number;
    details: string;
  };
  productTypeAlignment: {
    score: number;
    details: string;
  };
  geographyAlignment: {
    score: number;
    details: string;
  };
  presenceQualityScore: {
    score: number;
    details: string;
  };
  overallICPScore: number;
}

export interface RedFlag {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface ComplianceReport {
  guestName: string;
  company: string;
  generatedAt: string;

  profileOverview: {
    currentRole?: string;
    experience?: string;
    location?: string;
    linkedinData?: LinkedInProfile;
  };

  companyAnalysis: {
    profile: CompanyInfo;
    signals: {
      fundingStage?: string;
      profitabilityIndicators?: string[];
      growthSignals?: string[];
      newsHeadlines?: string[];
    };
  };

  onlinePresence: OnlinePresence & {
    qualityAssessment: string;
  };

  icpFitAnalysis: ICPFitAnalysis;

  redFlags: RedFlag[];

  recommendation: {
    status: 'strong-fit' | 'good-fit' | 'consider' | 'pass';
    confidence: number;
    reasoning: string[];
    suggestedFollowUp?: string[];
  };
}
