self.addEventListener('push', function (e) {
  console.log('Push notification received');
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    console.log('Push notifications are not allowed.');
    return;
  }

  if (e.data) {
    let dto = e.data.json();
    console.log('Push notification content', dto);
    e.waitUntil(
      self.registration
        .showNotification(dto.title, {
          body: dto.message,
          icon: '/images/logo.svg',
          data: dto.data,
          url: dto.url
        })
        .catch(function (err) {
          console.error('Push notification error', err);
        }),
    );
  }
});

self.addEventListener(
  'notificationclick',
  function (event) {
    const closedNotification = event.notification.close();
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then(windowClients => {
        const url = closedNotification.data.url;
        const matchingClient = windowClients.find(wc =>
          wc.url === url);
        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  },
  false,
);
