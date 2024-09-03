'use client'
import { useState } from 'react'
import Link from 'next/link'
import AboutModal from './AboutModal'
import Image from 'next/image'

export default function Header() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  return (
    <header className='bg-gray-800 text-white p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/'>
          <div className='flex items-center cursor-pointer'>
            <Image
              src='/mascot_notext.png' // Path to your mascot image
              alt='BlobHook Logo'
              width={40} // Adjust the width as needed
              height={40} // Adjust the height as needed
              className='mr-3'
            />
            <span className='text-2xl font-bold'>
              <span className='text-white-400'>Blob</span>
              <span className='text-blue-400'>Hook</span>
            </span>
          </div>
        </Link>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <button onClick={() => setIsAboutModalOpen(true)} className='hover:text-gray-300'>
                About
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </header>
  )
}
