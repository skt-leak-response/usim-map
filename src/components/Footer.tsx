'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400">
            Contact:{' '}
            <a href="mailto:response.skt.leak@gmail.com" className="hover:text-white">
              response.skt.leak@gmail.com
            </a>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/skt-leak-response/mail-to-rep"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
