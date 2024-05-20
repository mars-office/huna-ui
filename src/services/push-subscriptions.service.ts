import axios from "axios";
import { AddPushSubscriptionDto } from "../dto/add-push-subscription.dto";
import { AddPushSubscriptionResponseDto } from "../dto/add-push-subscription-response.dto";
import { DeletePushSubscriptionDto } from "../dto/delete-push-subscription.dto";
import { DeletePushSubscriptionResponseDto } from "../dto/delete-push-subscription-response.dto";
import { PublicVapidKeyResponseDto } from "../dto/public-vapid-key-response.dto";

export const pushSubscriptionsService = {
  getPublicVapidKey: async () => {
    return (
      await axios.get<PublicVapidKeyResponseDto>('/api/notifications/pushSubscriptions/publicVapidKey')
    ).data;
  },
  addPushSubscription: async (dto: AddPushSubscriptionDto) => {
    return (await axios.post<AddPushSubscriptionResponseDto>('/api/notifications/pushSubscriptions', dto)).data;
  },
  deletePushSubscription: async (dto: DeletePushSubscriptionDto) => {
    return (await axios.put<DeletePushSubscriptionResponseDto>('/api/notifications/pushSubscriptions/delete', dto)).data;
  }
};

export default pushSubscriptionsService;