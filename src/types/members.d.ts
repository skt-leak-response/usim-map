export interface Member {
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

declare module '@/data/members.json' {
  const members: Member[];
  export default members;
}
