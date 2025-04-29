'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MEMBERS } from '@/constants/members';
import { SiteConfig } from '@/constants/config';

import { Member } from '@/types/members';
import { decodeIds } from '@/utils/encoding';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailForm from '@/components/EmailForm/index';

export default function EmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const encodedIds = searchParams.get('ids');
    if (!encodedIds) {
      router.push('/');
      return;
    }

    try {
      const ids = decodeIds(encodedIds);
      const members = MEMBERS.filter((member) => ids.includes(member.id));
      setSelectedMembers(members);
    } catch (error) {
      console.error('Error processing IDs:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white">로딩 중...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (selectedMembers.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1">
        <EmailForm selectedMembers={selectedMembers} />
      </main>
      <Footer />
    </div>
  );
}
