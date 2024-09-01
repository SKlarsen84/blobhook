import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import pb from '../../lib/pocketbase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const uuid = uuidv4()

    try {
      // Store the UUID and metadata in PocketBase
      const record = await pb.collection('webhook_urls').create({
        uuid: uuid,
        createdAt: new Date()
      })

      // Return the generated URL
      res.status(200).json({ url: `${process.env.NEXT_PUBLIC_BASE_URL}/view/${uuid}` })
    } catch (error) {
      console.error('Error creating record in PocketBase:', error)
      res.status(500).json({ error: 'Failed to generate URL' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
