'use client';

import EmailForm from '@/components/EmailForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Member } from '@/types/members';

export default function EmailPage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        if (!ids) {
          setSelectedMembers([]);
          return;
        }

        const response = await fetch(`/api/members?ids=${ids}`);
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }
        const data = await response.json();
        setSelectedMembers(data);
      } catch (error) {
        console.error('Error fetching member data:', error);
        setSelectedMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [ids]);

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
