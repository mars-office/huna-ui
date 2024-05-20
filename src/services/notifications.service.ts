import axios from 'axios';
import { NotificationDto } from '../dto/notification.dto';
import { UnreadNotificationsDto } from '../dto/unread-notifications.dto';
import { MarkNotificationResponseDto } from '../dto/mark-notification-response.dto';

export const notificationsService = {
  getNotifications: async (start: number, count: number) => {
    return (
      await axios.get<NotificationDto[]>(
        `/api/notifications/notifications?start=${start}&count=${count}&sortBy=issuedAt&sortDir=desc`,
      )
    ).data;
  },
  getUnreadNotificationsCount: async () => {
    return (
      await axios.get<UnreadNotificationsDto>(
        `/api/notifications/notifications/unread`,
      )
    ).data;
  },
  markAsRead: async (id: string) => {
    return (
      await axios.put<MarkNotificationResponseDto>(
        `/api/notifications/notifications/${id}`,
      )
    ).data;
  },
  markAllAsRead: async () => {
    return (
      await axios.put<MarkNotificationResponseDto>(
        `/api/notifications/notifications`,
      )
    ).data;
  }
};

export default notificationsService;
