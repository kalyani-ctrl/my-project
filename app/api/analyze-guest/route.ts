import { NextRequest, NextResponse } from 'next/server';
import { GuestData, ComplianceReport } from '@/types';
import { generateComplianceReport } from '@/lib/reportGenerator';
import { scrapeGuestData } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const guestData: GuestData = await request.json();

    if (!guestData.name || !guestData.company) {
      return NextResponse.json(
        { error: 'Name and company are required' },
        { status: 400 }
      );
    }

    const scrapedData = await scrapeGuestData(guestData);
    const report = await generateComplianceReport(guestData, scrapedData);

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error analyzing guest:', error);
    return NextResponse.json(
      { error: 'Failed to analyze guest' },
      { status: 500 }
    );
  }
}
