import { WhoisRegistryService } from '@/services/whois/WhoisRegistryService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({
      code: 4001,
      message: 'Domain parameter is required',
    });
  }

  try {
    const whoisService = new WhoisRegistryService();
    const result = await whoisService.queryDomain(domain);

    return NextResponse.json({
      code: 2000,
      data: result,
    });
  } catch (error) {
    console.error('WHOIS query error:', error);
    return NextResponse.json({
      code: 5001,
      message: 'Failed to query WHOIS information',
    });
  }
}
