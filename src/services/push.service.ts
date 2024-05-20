export const pushService = {
  subscribe: async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted for Notifications');
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // Replace with your own VAPID public key
      applicationServerKey: '',
    });
    return subscription;
  },
};

export default pushService;
