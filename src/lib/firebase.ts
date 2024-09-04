// lib/firebase.ts

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { getMessaging, Messaging, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
let messaging: Messaging | null = null
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app)

  onMessage(messaging, payload => {
    console.log('Message received. ', payload)
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'Notification'
    const notificationOptions = {
      body: payload.notification?.body,
      icon: 'https://www.blobhook.com/_next/image?url=%2Fmascot_notext.png&w=48&q=75'
    }

    if (Notification.permission === 'granted') {
      new Notification(notificationTitle, notificationOptions)
    }
  })
}

export { db, collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc, doc, getMessaging, onMessage, messaging }
