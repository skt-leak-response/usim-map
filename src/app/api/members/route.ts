import { NextResponse } from 'next/server';
import membersData from '@/data/members.json';

interface Member {
  id: number;
  term: string;
  name: string;
  party: string;
  committees: string[];
  city: string;
  district: string;
  gender: string;
  election_count: string;
  election_method: string;
  email?: string;
}

const decompressIds = (compressed: string): number[] => {
  return compressed.split('_').map(Number);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const compressedIds = searchParams.get('ids');

  try {
    if (compressedIds) {
      const ids = decompressIds(compressedIds);
      const selectedMembers = membersData.filter((member) => ids.includes(member.id)) as Member[];
      return NextResponse.json(selectedMembers);
    } else {
      return NextResponse.json(membersData as Member[]);
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
