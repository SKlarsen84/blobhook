'use client'; // Ensure this component is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import the Image component
import pb from '../../../lib/pocketbase';
import { v4 as uuidv4 } from 'uuid';

interface RequestData {
  headers: any;
  body: any;
  method: string;
  timestamp: string;
}

const WebhookViewer = () => {
  const router = useRouter();
  const [uuid, setUuid] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  useEffect(() => {
    const pathname = window.location.pathname;
    const uuidFromPath = pathname.split('/').pop();
    if (uuidFromPath) {
      setUuid(uuidFromPath);
      setWebhookUrl(`${window.location.origin}/api/in/${uuidFromPath}`);
    }
  }, []);

  useEffect(() => {
    if (!uuid) return;

    const fetchData = async () => {
      try {
        const response = await pb.collection('requests').getFullList({
          filter: `uuid="${uuid}"`,
          sort: '-timestamp',
        });
        setRequests(response as any as RequestData[]);
        if (response.length > 0) {
          setSelectedRequest(response[0] as any as RequestData);
        }
      } catch (err) {
        setError('Failed to fetch requests');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    let unsubscribe: () => void = () => {};

    const subscribeToUpdates = async () => {
      try {
        const unsubscribeFunc = await pb.collection('requests').subscribe('*', (e) => {
          if (e.action === 'create' && e.record.uuid === uuid) {
            setRequests((prev) => [e.record as any as RequestData, ...prev]);
            setSelectedRequest(e.record as any as RequestData);
          }
        });
        unsubscribe = unsubscribeFunc;
      } catch (err) {
        setError('Failed to subscribe to real-time updates');
        console.error('Error subscribing to updates:', err);
      }
    };

    subscribeToUpdates();

    // Cleanup on component unmount
    return () => {
      unsubscribe();
    };
  }, [uuid]);

  const handleCopyUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl)
        .then(() => {
          alert('Webhook URL copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  const handleRefreshUuid = () => {
    const newUuid = uuidv4();
    setUuid(newUuid);
    setWebhookUrl(`${window.location.origin}/api/in/${newUuid}`);
    router.push(`/view/${newUuid}`);
  };

  return (
    <div className='flex h-screen bg-gray-100 text-gray-800'>
      {/* Sidebar */}
      <div className='w-1/4 bg-gray-200 p-4 overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-4'>Requests</h2>
        <ul className='space-y-2'>
          {requests.length > 0 ? (
            requests.map((req, index) => (
              <li
                key={index}
                onClick={() => setSelectedRequest(req)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedRequest === req ? 'bg-blue-300 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <p className='font-semibold'>{req.method}</p>
                <p className='text-sm'>{new Date(req.timestamp).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center flex-1 text-center'> {/* Centering the mascot and text */}

              <p className='text-gray-600 text-lg'>No requests yet...</p>
            </div>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className='w-3/4 p-6 flex flex-col'>
        {/* Top Bar */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center space-x-2'>
            {webhookUrl && (
              <>
                <input
                  type='text'
                  value={webhookUrl}
                  readOnly
                  className='p-2 border border-gray-400 rounded-lg w-96 bg-gray-100 text-gray-800'
                />
                <button onClick={handleCopyUrl} className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
                  Copy URL
                </button>
              </>
            )}
          </div>
          <button
            onClick={handleRefreshUuid}
            className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
          >
            Refresh UUID
          </button>
        </div>

        {/* Request Details */}
        {selectedRequest ? (
          <div className='bg-white p-6 rounded-lg shadow-md flex-1 overflow-y-auto text-gray-800'>
            <h3 className='text-2xl font-semibold mb-4'>Request Details</h3>
            <div className='mb-2'>
              <strong>Method:</strong> {selectedRequest.method}
            </div>
            <div className='mb-2'>
              <strong>Headers:</strong>
              <pre className='bg-gray-100 p-2 mt-1 rounded-lg overflow-x-auto'>
                {JSON.stringify(selectedRequest.headers, null, 2)}
              </pre>
            </div>
            <div className='mb-2'>
              <strong>Body:</strong>
              <pre className='bg-gray-100 p-2 mt-1 rounded-lg overflow-x-auto'>
                {JSON.stringify(selectedRequest.body, null, 2)}
              </pre>
            </div>
            <div className='mb-2'>
              <strong>Timestamp:</strong> {new Date(selectedRequest.timestamp).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center flex-1 text-center'> {/* Centering the mascot and text */}
            <Image
              src="/mascot.png" // Path to your mascot image
              alt="Mascot"
              width={200} // Adjust the width as needed
              height={200} // Adjust the height as needed
              className="mb-6" // Add margin-bottom for spacing
            />
            <p className='text-gray-600 text-lg'>No requests yet... Once a request is made, it will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookViewer;
