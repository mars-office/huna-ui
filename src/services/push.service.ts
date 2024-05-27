import pushSubscriptionsService from './push-subscriptions.service';

export class PushService {
  async getExistingSubscription() {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  }

  async hasPermission() {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async setOnPushNotificationReceivedListener<T>(cb: (event: MessageEvent<T>) => void) {
    await navigator.serviceWorker.ready;
    navigator.serviceWorker.addEventListener("message", cb);
  }

  async removeOnPushNotificationReceivedListener<T>(cb: (data: MessageEvent<T>) => void) {
    await navigator.serviceWorker.ready;
    navigator.serviceWorker.removeEventListener('message', cb);
  }

  async subscribe() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Permission not granted for Notifications');
        return null;
      }
      const publicVapidKeyResponse = await pushSubscriptionsService.getPublicVapidKey();
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKeyResponse.publicVapidKey,
      });
      const subscriptionJsonString = JSON.stringify(subscription.toJSON());
      await pushSubscriptionsService.addPushSubscription({
        json: subscriptionJsonString,
      });
      return subscription;
    } catch (err: any) {
      console.error('Error while requesting push subscription', err);
    }
  }

  async unsubscribe() {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      return;
    }
    const existingSubscription = await registration.pushManager.getSubscription();
    if (!existingSubscription) {
      return;
    }
    const json = JSON.stringify(existingSubscription.toJSON());
    await existingSubscription.unsubscribe();
    const deleteReply = await pushSubscriptionsService.deletePushSubscription({
      json: json,
    });
    return deleteReply._id;
  }
}

export const pushService = new PushService();
export default pushService;
