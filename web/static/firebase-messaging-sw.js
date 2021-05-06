
importScripts(
  'https://www.gstatic.com/firebasejs/8.4.0/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/8.4.0/firebase-messaging.js'
)
firebase.initializeApp({"apiKey":"AIzaSyAmrU77MaEFv088YUOba9wsdKV8JdhRKe0","authDomain":"challenge-me-ed753.firebaseapp.com","projectId":"challenge-me-ed753","storageBucket":"challenge-me-ed753.appspot.com","messagingSenderId":"593146021377","appId":"1:593146021377:web:55fcc7017f5782a9e0a200","measurementId":"G-CM3E4VZQKE"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

self.addEventListener('push', function (e) {
  data = e.data.json()
  var options = {
    body: data.notification.body,
    icon: data.notification.icon,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
  }
})
