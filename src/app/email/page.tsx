'use client';

import EmailForm from '@/components/EmailForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface EmailPageProps {
  searchParams: {
    members: string;
  };
}

export default function EmailPage({ searchParams }: EmailPageProps) {
  const selectedMembers = JSON.parse(decodeURIComponent(searchParams.members || '[]'));

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
