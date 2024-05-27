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
    event.notification.close();
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
              if (event.notification.data.url) {
                windowClients[0].navigate(event.notification.data.url);
              }
              return;
            }
            return clients.openWindow(self.location.origin).then(wc => {
              wc.focus();
              if (event.notification.data.url) {
                wc.navigate(event.notification.data.url);
              }
            });
          }),
      );
  },
  false,
);
