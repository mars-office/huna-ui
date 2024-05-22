import pushSubscriptionsService from "./push-subscriptions.service";

export class PushService {
  private _reg: ServiceWorkerRegistration | undefined;

  async subscribe() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted for Notifications');
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    this._reg = registration;

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Subscription already exists');
      return;
    }

    const publicVapidKeyResponse = await pushSubscriptionsService.getPublicVapidKey();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKeyResponse.publicVapidKey,
    });
    const subscriptionJsonString = JSON.stringify(subscription.toJSON());
    const addResult = await pushSubscriptionsService.addPushSubscription({
      json: subscriptionJsonString
    });
    return addResult._id;
  }

  async unsubscribe() {
    if (!this._reg) {
      return;
    }
    const existingSubscription = await this._reg.pushManager.getSubscription();
    if (!existingSubscription) {
      return;
    }
    const json = JSON.stringify(existingSubscription.toJSON());
    await existingSubscription.unsubscribe();
    const deleteReply = await pushSubscriptionsService.deletePushSubscription({
      json: json
    });
    return deleteReply._id;
  }
}

export const pushService = new PushService();
export default pushService;