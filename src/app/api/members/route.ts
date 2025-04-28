import { NextResponse } from 'next/server';
import membersData from '@/data/members.json';

interface Member {
  term: string;
  name: string;
  party: string;
  committees: string[];
  city: string;
  district: string;
  gender: string;
  election_count: string;
  election_method: string;
  email: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const party = searchParams.get('party');
  const committee = searchParams.get('committee');
  const city = searchParams.get('city');
  const district = searchParams.get('district');

  try {
    let filteredMembers: Member[] = membersData;

    if (party) {
      filteredMembers = filteredMembers.filter((member) => member.party === party);
    }
    if (committee) {
      filteredMembers = filteredMembers.filter((member) =>
        member.committees.some((c) => c === committee),
      );
    }
    if (city) {
      filteredMembers = filteredMembers.filter((member) => member.city === city);
    }
    if (district) {
      filteredMembers = filteredMembers.filter((member) => member.district === district);
    }

    return NextResponse.json(filteredMembers);
  } catch (error) {
    console.error('Error processing members:', error);
    return NextResponse.json({ error: 'Failed to process members' }, { status: 500 });
  }
}
