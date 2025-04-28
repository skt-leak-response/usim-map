'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <Container>
        <div className="flex justify-between h-16 items-center">
          <Button variant="ghost" asChild>
            <Link href="/" className="text-white text-xl font-bold">
              국회의원 메일 보내기
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
