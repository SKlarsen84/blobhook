import { NextApiRequest, NextApiResponse } from 'next'

import admin, { initializeApp } from 'firebase-admin'
import { cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  })
}

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
})

const db = getFirestore(app)

const messaging = admin.messaging()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uuid } = req.query

  if (!uuid || typeof uuid !== 'string') {
    return res.status(400).json({ error: 'Invalid UUID' })
  }

  try {
    await db.collection('requests').add({
      uuid,
      headers: req.headers,
      body: req.body,
      method: req.method,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      responseCode: res.statusCode
    })

/*     //get all subscriptions from the subscriptions collection for this uuid.
    const subscriptionSnapshot = await db.collection('subscriptions').where('uuid', '==', uuid).get()
    const subscriptions = subscriptionSnapshot.docs.map(doc => doc.data())

    // Send push notifications to subscribed users
    if (!subscriptionSnapshot.empty) {
      const tokens = subscriptionSnapshot.docs.map(doc => doc.data().token)
      const message = {
        notification: {
          title: 'New Webhook Request',
          body: `A new request was made to webhook ${uuid}`
        },
        tokens
      }

      await messaging.sendEachForMulticast(message)
    } */

    res.status(200).json({ message: 'Request received' })
  } catch (error) {
    console.error('Error saving request:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
