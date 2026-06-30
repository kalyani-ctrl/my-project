import axios from 'axios';
import { GuestData, LinkedInProfile, CompanyInfo, OnlinePresence } from '@/types';

const MOCK_DELAY = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ScrapedData {
  linkedinProfile?: LinkedInProfile;
  companyInfo?: CompanyInfo;
  onlinePresence?: OnlinePresence;
  newsHeadlines?: string[];
  socialSignals?: {
    twitterUrl?: string;
    youtubeUrl?: string;
    personalBlog?: string;
  };
}

export async function scrapeGuestData(guestData: GuestData): Promise<ScrapedData> {
  const scrapedData: ScrapedData = {};

  try {
    if (guestData.linkedinUrl) {
      scrapedData.linkedinProfile = await scrapeLinkedInProfile(guestData.linkedinUrl);
    } else {
      scrapedData.linkedinProfile = await searchLinkedInProfile(guestData.name, guestData.company);
    }
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
  }

  try {
    scrapedData.companyInfo = await scrapeCompanyInfo(guestData.company);
  } catch (error) {
    console.error('Error scraping company info:', error);
  }

  try {
    scrapedData.newsHeadlines = await scrapeNews(guestData.name, guestData.company);
  } catch (error) {
    console.error('Error scraping news:', error);
  }

  try {
    scrapedData.onlinePresence = await scrapeOnlinePresence(guestData.name, guestData.company);
  } catch (error) {
    console.error('Error scraping online presence:', error);
  }

  return scrapedData;
}

async function scrapeLinkedInProfile(url: string): Promise<LinkedInProfile> {
  await MOCK_DELAY(500);

  const profile: LinkedInProfile = {
    name: 'Extracted Name',
    headline: 'Founder & CEO',
    location: 'San Francisco, CA',
    followers: Math.floor(Math.random() * 50000) + 1000,
    connections: Math.floor(Math.random() * 10000) + 500,
    positionsCount: Math.floor(Math.random() * 8) + 1,
    recentPosition: {
      title: 'Founder & CEO',
      company: 'Their Company',
      duration: '2+ years',
    },
  };

  return profile;
}

async function searchLinkedInProfile(name: string, company: string): Promise<LinkedInProfile> {
  await MOCK_DELAY(300);

  return {
    name,
    headline: `Founder at ${company}`,
    location: 'US/EU',
    followers: Math.floor(Math.random() * 30000) + 500,
    connections: Math.floor(Math.random() * 5000) + 300,
    positionsCount: Math.floor(Math.random() * 6) + 1,
    recentPosition: {
      title: 'Founder & CEO',
      company,
      duration: '1-3 years',
    },
  };
}

async function scrapeCompanyInfo(company: string): Promise<CompanyInfo> {
  await MOCK_DELAY(400);

  const stages = ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Bootstrapped'];
  const industries = ['SaaS', 'DevTools', 'MarTech', 'FinTech', 'E-commerce', 'API'];
  const sizes = ['1-10', '11-50', '51-100', '101-250', '251-500', '500+'];

  const stage = stages[Math.floor(Math.random() * stages.length)];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const size = sizes[Math.floor(Math.random() * sizes.length)];

  return {
    name: company,
    industry,
    size,
    founded: 2020 + Math.floor(Math.random() * 4),
    location: 'San Francisco / Remote',
    description: `${company} is a ${industry} company focused on solving enterprise software needs.`,
    funding: {
      stage,
      totalRaised: stage === 'Bootstrapped' ? 'Profitable' : `$${Math.floor(Math.random() * 50) + 1}M`,
      lastRound: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    employees: parseInt(size.split('-')[size.split('-').length - 1]),
    publicSignals: {
      hasExited: Math.random() > 0.8,
      fundingStage: stage,
      isHiring: Math.random() > 0.3,
      recentNews: generateMockNews(company),
    },
  };
}

async function scrapeNews(name: string, company: string): Promise<string[]> {
  await MOCK_DELAY(300);

  return generateMockNews(company);
}

function generateMockNews(company: string): string[] {
  const newsTemplates = [
    `${company} raises Series A funding`,
    `${company} acquires competitor in strategic move`,
    `${company} expands to European market`,
    `${company} announces new product launch`,
    `${company} hits profitability milestone`,
    `${company} joins Y Combinator batch`,
  ];

  return newsTemplates
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1);
}

async function scrapeOnlinePresence(name: string, company: string): Promise<OnlinePresence> {
  await MOCK_DELAY(350);

  return {
    linkedinFollowers: Math.floor(Math.random() * 50000) + 1000,
    twitterFollowers: Math.random() > 0.5 ? Math.floor(Math.random() * 30000) + 500 : 0,
    youtubePresence: Math.random() > 0.6,
    youtubeSubscribers: Math.random() > 0.7 ? Math.floor(Math.random() * 10000) + 100 : 0,
    blogPresence: Math.random() > 0.4,
    speakingEngagements: Math.floor(Math.random() * 15) + 1,
    contentQualityScore: Math.floor(Math.random() * 30) + 60,
  };
}
