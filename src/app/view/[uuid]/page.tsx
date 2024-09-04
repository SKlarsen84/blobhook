'use client' // Ensure this component is a client component

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  db,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  messaging
} from '../../../lib/firebase'
import { getToken } from 'firebase/messaging'
import { v4 as uuidv4 } from 'uuid'
import ReactJson from 'react-json-view'

interface RequestData {
  headers: any
  body: any
  method: string
  timestamp: string
  ip?: string
  responseCode?: string
}

const WebhookViewer = () => {
  const router = useRouter()
  const [uuid, setUuid] = useState<string | null>(null)
  const [requests, setRequests] = useState<RequestData[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)

  useEffect(() => {
    if (messaging) {
      // Register the service worker
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope)
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  useEffect(() => {
    const pathname = window.location.pathname
    const uuidFromPath = pathname.split('/').pop()
    if (uuidFromPath) {
      setUuid(uuidFromPath)
      setWebhookUrl(`${window.location.origin}/api/in/${uuidFromPath}`)
    }
  }, [])

  useEffect(() => {
    if (!uuid) return

    const fetchData = async () => {
      try {
        const q = query(collection(db, 'requests'), where('uuid', '==', uuid))
        const querySnapshot = await getDocs(q)
        const requestsData = querySnapshot.docs.map(doc => doc.data() as RequestData)
        // Sort requests by timestamp in descending order
        const sortedRequests = requestsData.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        setRequests(sortedRequests)
        if (sortedRequests.length > 0) {
          setSelectedRequest(sortedRequests[0])
        }
      } catch (err) {
        setError('Failed to fetch requests')
        console.error('Error fetching data:', err)
      }
    }

    fetchData()

    // Subscribe to real-time updates
    const q = query(collection(db, 'requests'), where('uuid', '==', uuid))
    const unsubscribe = onSnapshot(q, snapshot => {
      const newRequests = snapshot.docs.map(doc => doc.data() as RequestData)
      // Sort new requests by timestamp in descending order
      const sortedNewRequests = newRequests.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setRequests(sortedNewRequests)
      if (sortedNewRequests.length > 0) {
        setSelectedRequest(sortedNewRequests[0])
      }
    })

    // Check subscription status
    const checkSubscription = async () => {
      const subscriptionQuery = query(collection(db, 'subscriptions'), where('uuid', '==', uuid))
      const subscriptionSnapshot = await getDocs(subscriptionQuery)
      setIsSubscribed(!subscriptionSnapshot.empty)
    }

    checkSubscription()

    // Cleanup on component unmount
    return () => {
      unsubscribe()
    }
  }, [uuid])

  const handleCopyUrl = () => {
    if (webhookUrl) {
      navigator.clipboard
        .writeText(webhookUrl)
        .then(() => {
          alert('Webhook URL copied to clipboard!')
        })
        .catch(err => {
          console.error('Failed to copy text: ', err)
        })
    }
  }

  const handleRefreshUuid = () => {
    const newUuid = uuidv4()
    setUuid(newUuid)
    setWebhookUrl(`${window.location.origin}/api/in/${newUuid}`)
    router.push(`/view/${newUuid}`)
  }

  const handleSubscriptionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uuid) return

    setIsSubscribing(true)

    if (e.target.checked) {
      // Request notification permission only when subscribing
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert('Notification permission denied')
        setIsSubscribing(false)
        return
      }

      // Get FCM token
      try {
        console.log(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        if (messaging) {
          const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY })
          setFcmToken(token)
          await addDoc(collection(db, 'subscriptions'), { uuid, token })
          setIsSubscribed(true)
        } else {
          console.error('Messaging is not initialized')
        }
      } catch (err) {
        console.error('Failed to subscribe:', err)
      }
    } else {
      // Unsubscribe
      try {
        const subscriptionQuery = query(collection(db, 'subscriptions'), where('uuid', '==', uuid))
        const subscriptionSnapshot = await getDocs(subscriptionQuery)
        subscriptionSnapshot.forEach(async doc => {
          await deleteDoc(doc.ref)
        })
        setIsSubscribed(false)
      } catch (err) {
        console.error('Failed to unsubscribe:', err)
      }
    }

    setIsSubscribing(false) 
  }

  useEffect(() => {
    if (selectedRequest) {
      const { 'x-vercel-sc-headers': _, 'forwarded': __, ...headersWithoutVercelScHeaders } = selectedRequest.headers;
      setSelectedRequest(prev => prev ? {
        ...prev,
        headers: headersWithoutVercelScHeaders
      } : null);
    }
  }, [selectedRequest]);

  const getMethodStyles = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'POST':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'PUT':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'DELETE':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'PATCH':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className='flex flex-col md:flex-row  min-h-[calc(100vh-7rem)]  text-gray-800'>
      {/* Sidebar */}
      <div className='w-full md:w-1/5 bg-gray-100 border-b md:border-b-2 md:border-r border-gray-400 p-4 overflow-y-auto'>
        <h2 className='text-lg font-semibold mb-4'>Messages</h2>
        <ul className='space-y-2 max-h-[6.6rem] md:max-h-none overflow-y-auto'>
          {requests.length > 0 ? (
            requests.map((req, index) => (
              <li
                key={index}
                onClick={() => setSelectedRequest(req)}
                className={`p-3 rounded-lg cursor-pointer m-1 border ${getMethodStyles(req.method)} ${
                  selectedRequest === req ? 'ring-1 ring-black-100' : ''
                }`}
              >
                <p className='font-medium'>{req.method}</p>
                <p className='text-xs text-gray-500'>{new Date(req.timestamp).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <div className='text-center text-gray-600'>No requests yet...</div>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6 flex flex-col overflow-y-auto'>
        {/* Top Bar */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-2'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 w-full'>
            {webhookUrl && (
              <>
                <div className='relative flex-grow'>
                  <input
                    type='text'
                    value={webhookUrl}
                    readOnly
                    className='p-2 pr-10 border border-gray-300 rounded-lg w-full bg-gray-50 text-gray-800'
                  />
                  <label
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 cursor-pointer'
                    title='Subscribe to notifications for this webhook'
                  >
                    {isSubscribing ? (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
                    ) : (
                      <input
                        type='checkbox'
                        checked={isSubscribed}
                        onChange={handleSubscriptionChange}
                        className='form-checkbox h-4 w-4'
                      />
                    )}
                    <span role='img' aria-label='bell' className='text-lg'>
                      🔔
                    </span>
                  </label>
                </div>
                <button
                  onClick={handleCopyUrl}
                  className='bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 w-full h-full sm:w-auto flex items-center justify-center'
                >
                  <Image
                    src='/copy.png' // Path to your copy icon image
                    alt='Copy Icon'
                    width={22} // Adjust the width as needed
                    height={22} // Adjust the height as needed
                    title='Copy URL'
                  />
                </button>
              </>
            )}
          </div>
          <button
            onClick={handleRefreshUuid}
            className='bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 w-full h-full sm:w-auto flex items-center justify-center'
          >
            <Image
              src='/refresh.png' // Path to your refresh icon image
              alt='Refresh Icon'
              width={22} // Adjust the width as needed
              height={22} // Adjust the height as needed
              title='Refresh UUID'
            />
          </button>
        </div>

        {/* Request Details */}
        {selectedRequest ? (
          <div className='bg-white p-6 rounded-lg shadow-md flex-1 overflow-y-auto'>
            <div className='flex gap-4'>
              <div className='w-1/4'>
                <h4 className='text-lg font-medium'>Details</h4>
                <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                  <div className='mb-2'>
                    <strong>Method:</strong> {selectedRequest.method}
                  </div>
                  <div className='mb-2'>
                    <strong>Date:</strong> {new Date(selectedRequest.timestamp).toLocaleString()}
                  </div>
                  <div className='mb-2'>
                    <strong>IP:</strong> {selectedRequest.headers['x-vercel-proxied-for'] || 'N/A'}
                  </div>
                </div>
              </div>

              <div className='w-3/4'>
                <h4 className='text-lg font-medium'>Request Headers</h4>
                <div
                  className='bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-y-auto'
                  style={{ height: '244px' }}
                >
                  <ReactJson
                    src={selectedRequest.headers}
               
                    displayDataTypes={false}
                    name={false}
                    collapsed={1}
                    enableClipboard={false}
                    style={{ fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>
            <div className='mt-6'>
              <h4 className='text-lg font-medium'>Request Body</h4>
              <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                {typeof selectedRequest.body === 'object' && selectedRequest.body !== null ? (
                  <ReactJson
                    src={selectedRequest.body}
                    displayDataTypes={false}
                    name={false}
                    collapsed={1}
                    enableClipboard={false}
                    style={{ fontSize: '12px' }}
                  />
                ) : (
                  <pre className='text-xs whitespace-pre-wrap'>{String(selectedRequest.body)}</pre>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center flex-1 text-center'>
            <Image
              src='/mascot.png' // Path to your mascot image
              alt='Mascot'
              width={200} // Adjust the width as needed
              height={200} // Adjust the height as needed
              className='mb-6'
            />
            <p className='text-gray-600 text-lg'>No requests yet... Once a request is made, it will show up here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebhookViewer
