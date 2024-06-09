import axios from 'axios';
import { SendCustomNotificationDto } from '../contracts/send-custom-notification.dto';
import { SendCustomNotificationResponseDto } from '../contracts/send-custom-notification-response.dto';


export const notificationsAdminService = {
  send: async (dto: SendCustomNotificationDto) => {
    return (
      await axios.post<SendCustomNotificationResponseDto>(
        `/api/notifications/admin/send`,
        dto
      )
    ).data;
  },
};

export default notificationsAdminService;
