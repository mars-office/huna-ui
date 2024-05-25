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
          data: dto
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
    console.log('Notification clicked');
    console.log(event);
    event.notification.close();
    if (event.notification.data.url) {
      event.waitUntil(
        clients
          .matchAll({
            type: 'window',
            includeUncontrolled: true,
          })
          .then((windowClients) => {
            console.log('Window clients', windowClients);
            if (windowClients && windowClients.length > 0) {
              windowClients[0].focus();
              return;
            }
            const url = event.notification.data.url;
            return clients.openWindow(url);
          }),
      );
    }
  },
  false,
);
