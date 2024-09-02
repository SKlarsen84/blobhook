'use client'; // Ensure this component is a client component

import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import the Image component
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  const handleStartWebhook = () => {
    const newUuid = uuidv4(); // Generate a new UUID
    router.push(`/view/${newUuid}`); // Redirect to the view page with the new UUID
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800 p-24">
      <div className="flex flex-col items-center text-center"> {/* Ensure flex column and center alignment */}
        <Image
          src="/mascot.png" // Path to your mascot image
          alt="Mascot"
          width={200} // Adjust the width as needed
          height={200} // Adjust the height as needed
          className="mb-6" // Add margin-bottom for spacing
        />
      
        <p className="text-lg mb-8">
          Easily create and monitor webhooks in real-time. Click the button below to start your first webhook.
        </p>
        <button
          onClick={handleStartWebhook}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Start a Webhook
        </button>
      </div>
    </main>
  );
}
