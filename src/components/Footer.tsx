'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Mail, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 pt-6 pb-2">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center text-gray-200 gap-2">
            <Mail className="w-5 h-5 mr-1" />
            <span>Contact:</span>
            <a
              href="mailto:response.skt.leak@gmail.com"
              className="hover:text-white underline underline-offset-2"
            >
              response.skt.leak@gmail.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="link"
              asChild
              className="flex items-center gap-1 text-gray-200 hover:text-white"
            >
              <Link
                href="https://github.com/skt-leak-response/mail-to-rep"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-200 hover:text-white"
              >
                <Github className="w-5 h-5 mr-1" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SKT 개인정보 유출 사건 국민행동. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
