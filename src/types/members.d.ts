export interface Member {
  term: string;
  name: string;
  party: string;
  committees: string[];
  city: string;
  district: string;
  gender: string;
  election_count: string;
  election_method: string;
}

declare module '@/data/members.json' {
  const members: Member[];
  export default members;
}
