// src/components/Header.tsx

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <header className='bg-gray-900 text-white p-4'>
      <div className='container mx-auto flex items-right justify-end ml-0'>
        <Link href='https://github.com/SKlarsen84/blobhook'>
          <div className='flex items-center cursor-pointer'>
            <span className='text-xs'>
              <span className='text-white-400'>Made with ❤️ by Stefan Larsen</span>
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
};

export default Footer
