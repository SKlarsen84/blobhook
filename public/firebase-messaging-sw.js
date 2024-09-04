importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyDuggWbonjNsi4XZbthGHu49g33KTAnI6c',
  authDomain: 'blobhook.firebaseapp.com',
  projectId: 'blobhook',
  storageBucket: 'blobhook.appspot.com',
  messagingSenderId: '171404026703',
  appId: '1:171404026703:web:8aca22259f8e24512adb3a'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/mascot_notext.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
