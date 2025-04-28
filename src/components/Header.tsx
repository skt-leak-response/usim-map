'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-white text-xl font-bold">
            국회의원 메일 보내기
          </Link>
        </div>
      </div>
    </header>
  );
}
