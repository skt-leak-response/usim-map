'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400">
            Contact:{' '}
            <Button variant="link" asChild>
              <a href="mailto:response.skt.leak@gmail.com" className="hover:text-white">
                response.skt.leak@gmail.com
              </a>
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button variant="link" asChild>
              <Link
                href="https://github.com/skt-leak-response/mail-to-rep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
