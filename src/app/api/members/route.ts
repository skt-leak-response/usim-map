import { NextResponse } from 'next/server';
import membersData from '@/data/members.json';

export interface Member {
  name: string;
  party: string;
  committee: string;
  region: string;
  subRegion: string;
  email: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const party = searchParams.get('party');
    const committee = searchParams.get('committee');
    const region = searchParams.get('region');
    const subRegion = searchParams.get('subRegion');

    let filteredMembers: Member[] = membersData;

    if (party) {
      filteredMembers = filteredMembers.filter((member: Member) => member.party === party);
    }
    if (committee) {
      filteredMembers = filteredMembers.filter((member: Member) => member.committee === committee);
    }
    if (region) {
      filteredMembers = filteredMembers.filter((member: Member) => member.region === region);
    }
    if (subRegion) {
      filteredMembers = filteredMembers.filter((member: Member) => member.subRegion === subRegion);
    }

    return NextResponse.json({
      members: filteredMembers,
      total: filteredMembers.length,
    });
  } catch (error) {
    console.error('Error processing members:', error);
    return NextResponse.json({ error: 'Failed to process members data' }, { status: 500 });
  }
}
