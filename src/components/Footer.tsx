import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white p-4'>
      <div className='mx-auto flex items-right justify-end ml-0'>
        <Link href='https://github.com/SKlarsen84/blobhook'>
          <div className='flex items-center cursor-pointer'>
            <span className='text-xs'>
              <span className='text-white-400'>Made and open sourced with ❤️</span>
            </span>
          </div>
        </Link>
      </div>
    </footer>
  )
};

export default Footer
