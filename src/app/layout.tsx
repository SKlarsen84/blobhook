import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect } from 'react'
import { messaging } from '@/lib/firebase'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlobHook',
  description: 'Free and open-source webhook testing tool.Easily create, test and monitor webhooks in real-time. '
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
