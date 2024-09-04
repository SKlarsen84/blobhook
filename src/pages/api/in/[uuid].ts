import { NextApiRequest, NextApiResponse } from 'next'

import admin from 'firebase-admin'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { db, messaging } from '@/lib/firebaseAdmin'

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

    console.log('Subscriptions: ', subscriptions)
    // Send push notifications to subscribed users
    if (!subscriptionSnapshot.empty) {
      console.log('Sending push notifications to ' + subscriptions.length + ' users')
      const tokens = subscriptionSnapshot.docs.map(doc => doc.data().token)

      // Construct the message object
      const message = {
        notification: {
          title: 'New Webhook Request',
          body: `A new request was made to webhook ${uuid}`,
        },
        webpush: {
          headers: {
            Urgency: 'high' // Ensure the notification is shown immediately
          },
          fcmOptions: {
            link: 'https://blobhook.com/view/' + uuid // URL the user will be directed to on click
          }
        },
        tokens: tokens
      }
      // Send the push notification to all tokens using multicast
      const response = await messaging.sendEachForMulticast(message)

      // Optionally, log or handle any failures
      if (response.failureCount > 0) {
        console.log('Failed to send push notifications to ' + response.failureCount + ' users')
        console.log('Failed tokens: ', response.responses)
        const failedTokens = response.responses
          .map((resp, idx) => (!resp.success ? tokens[idx] : null))
          .filter(token => token != null)
        console.log('Failed tokens: ', failedTokens)
      }
    }

    res.status(200).json({ message: 'Request received' })
  } catch (error) {
    console.error('Error saving request:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default handler
