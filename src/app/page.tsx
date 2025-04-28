'use client';

import { useState } from 'react';
import { Member } from '@/types/members';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberList from '@/components/MemberList/index';

export default function Home() {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">국회의원 선택</h1>
          <p className="text-gray-300">이메일을 보낼 국회의원을 선택해주세요. (최대 300명)</p>
        </div>

        <MemberList onSelectionChange={setSelectedMembers} />
      </main>
      <Footer />
    </div>
  );
}
