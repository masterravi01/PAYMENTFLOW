self.addEventListener("push", function (event) {
  if (!event.data) {
    console.error("Push event does not contain data");
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.notification.body,
    icon: data.notification.icon,
    badge: data.notification.badge,
    data: data.notification.data,
  };

  event.waitUntil(
    self.registration.showNotification(data.notification.title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
