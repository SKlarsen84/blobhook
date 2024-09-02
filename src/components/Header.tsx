// src/components/Header.tsx

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex items-center justify-between ml-0">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image
              src="/mascot_notext.png" // Path to your mascot image
              alt="BlobHook Logo"
              width={40} // Adjust the width as needed
              height={40} // Adjust the height as needed
              className="mr-3"
            />
            <span className="text-2xl font-bold">
              <span className="text-white-400">Blob</span>
              <span className="text-blue-400">Hook</span>
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
