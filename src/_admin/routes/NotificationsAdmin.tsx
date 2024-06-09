import {
  Field,
} from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SendCustomNotificationDto } from '../contracts/send-custom-notification.dto';

export const NotificationsAdmin = () => {
  const { t } = useTranslation();
  const [request, _setRequest] = useState<SendCustomNotificationDto>({
    deliveryTypes: [],
    message: '',
    title: '',
    severity: 'info',
    toUserEmails: [],
  });
  return (
    <div>
      <Field label={t('ui.admin.notificationsAdmin.userEmails')}>
        {request.toUserEmails}
      </Field>
    </div>
  );
};

export default NotificationsAdmin;
