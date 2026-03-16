// Firebase Cloud Messaging Service Worker
// Must be served from /public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCm5ab7U2X68nVH1uj8Yzm9sdYOFhjA9WQ",
  authDomain: "minutes-of-meeting-490003.firebaseapp.com",
  projectId: "minutes-of-meeting-490003",
  messagingSenderId: "206409181885",
  appId: "1:206409181885:web:9c44bcee034842c27b25d4",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title = "New Notification", body = "" } = payload.notification ?? {};

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data ?? {},
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
