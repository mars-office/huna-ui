import { NotificationSeverity } from "../../dto/notification-severity";
import { DeliveryType } from "./delivery-type";

export interface SendCustomNotificationDto {
  toUserEmails: string[];
  title: string;
  message: string;
  severity: NotificationSeverity;
  deliveryTypes: DeliveryType[];
  url?: string;
  data?: any;
}