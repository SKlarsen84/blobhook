importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyDuggWbonjNsi4XZbthGHu49g33KTAnI6c',
  authDomain: 'blobhook.firebaseapp.com',
  projectId: 'blobhook',
  storageBucket: 'blobhook.appspot.com',
  messagingSenderId: '171404026703',
  appId: '1:171404026703:web:8aca22259f8e24512adb3a',
  measurementId: 'G-WBP4YFEQKP'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: 'New request made to ' + payload.notification.body,
    icon: 'https://www.blobhook.com/_next/image?url=%2Fnotification.png&w=32&q=75',
    data: { url: `https://blobhook.com/view/${payload.notification.body}` }
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
