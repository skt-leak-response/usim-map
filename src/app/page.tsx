'use client';
import MemberList from '@/components/MemberList';
import { MEMBER_CONSTANTS } from '@/constants/members';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {MEMBER_CONSTANTS.MAIN_PAGE.TITLE}
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            {MEMBER_CONSTANTS.MAIN_PAGE.DESCRIPTION}
          </p>
        </div>

        <MemberList />
      </div>
    </main>
  );
}
