'use client'
import { useState } from 'react';
import Link from 'next/link';
import AboutModal from './AboutModal';

export default function Header() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BlobHook
        </Link>
        <nav>
          <ul className="flex space-x-4">
    
            <li>
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="hover:text-gray-300"
              >
                About
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </header>
  );
}