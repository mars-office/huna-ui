import pushSubscriptionsService from "./push-subscriptions.service";

export class PushService {

  async subscribe() {
    await Notification.requestPermission();
    const registration = await navigator.serviceWorker.ready;

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    const publicVapidKeyResponse = await pushSubscriptionsService.getPublicVapidKey();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKeyResponse.publicVapidKey,
    });
    const subscriptionJsonString = JSON.stringify(subscription.toJSON());
    await pushSubscriptionsService.addPushSubscription({
      json: subscriptionJsonString
    });
    return subscription;
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
      json: json
    });
    return deleteReply._id;
  }
}

export const pushService = new PushService();
export default pushService;
