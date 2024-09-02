import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing Firebase environment variables')
}

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
})

const db = getFirestore(app)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uuid } = req.query

  if (!uuid || Array.isArray(uuid)) {
    return res.status(400).json({ error: 'Invalid UUID' })
  }

  try {
    // Log the request in Firestore
    await db.collection('requests').add({
      uuid: uuid,
      webhook_url: uuid,
      method: req.method,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    })

    res.status(200).json({ message: 'Request logged successfully' })
  } catch (error) {
    console.error('Error logging request:', error)
    res.status(500).json({ error: 'Failed to log request' })
  }
}
