import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
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
                </Dialog.Title>
                
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    BlobHook is a powerful tool for spinning up and testing webhook endpoints. It provides a simple and
                    efficient way to create, manage, and test webhooks for your applications.
                  </p>
                  <p className='text-sm text-gray-500 mt-2'>
                    <strong>Use BlobHook for:</strong>
                    <ul className='list-disc list-inside mt-1'>
                      <li>Creating temporary webhook endpoints</li>
                      <li>Testing webhook integrations</li>
                      <li>Debugging webhook payloads</li>
                      <li>Simulating webhook responses</li>
                    </ul>
                  </p>
                  <p className='text-sm text-gray-500 mt-2'>
                    <strong>Do not use BlobHook for:</strong>
                    <ul className='list-disc list-inside mt-1'>
                      <li>Production-level webhook endpoints</li>
                      <li>Storing sensitive or personal information</li>
                      <li>Long-term data storage</li>
                    </ul>
                  </p>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}