import type { NextApiRequest, NextApiResponse } from 'next'
import pb from '../../../lib/pocketbase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uuid } = req.query

  if (!uuid || Array.isArray(uuid)) {
    return res.status(400).json({ error: 'Invalid UUID' })
  }

  try {
    // Log the request in PocketBase
    await pb.collection('requests').create({
      uuid: uuid,
      webhook_url: uuid,
      method: req.method,
      headers: req.headers,
      body: req.body,
      timestamp: new Date()
    })

    res.status(200).json({ message: 'Request logged successfully' })
  } catch (error) {
    console.error('Error logging request:', error)
    res.status(500).json({ error: 'Failed to log request' })
  }
}
