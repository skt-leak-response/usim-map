'use client';

import { useState } from 'react';
import { Member } from '@/types/members';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemberList from '@/components/MemberList/index';
import { Metadata } from 'next';
import { SiteConfig } from '@/constants/config';

export const metadata: Metadata = {
  title: 'SKT 개인정보 유출 사건 국민행동 - 메인',
  description:
    'SKT 개인정보 유출 사건에 대한 국민행동 플랫폼입니다. 국회의원들에게 항의 메일을 보내고 의견을 전달하세요.',
  openGraph: {
    title: 'SKT 개인정보 유출 사건 국민행동 - 메인',
    description:
      'SKT 개인정보 유출 사건에 대한 국민행동 플랫폼입니다. 국회의원들에게 항의 메일을 보내고 의견을 전달하세요.',
  },
};

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
