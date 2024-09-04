import { NextApiRequest, NextApiResponse } from 'next'

import admin from 'firebase-admin'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { db } from '@/lib/firebaseAdmin'

const messaging = admin.messaging()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uuid } = req.query

  if (!uuid || typeof uuid !== 'string') {
    return res.status(400).json({ error: 'Invalid UUID' })
  }

  try {
    await db.collection('requests').add({
      uuid: uuid,
      webhook_url: uuid,
      method: req.method,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    })

    //get all subscriptions from the subscriptions collection for this uuid.
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
    }

    res.status(200).json({ message: 'Request received' })
  } catch (error) {
    console.error('Error saving request:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
