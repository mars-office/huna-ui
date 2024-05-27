import { Checkbox, CheckboxOnChangeData, Title1, Title2 } from '@fluentui/react-components';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import pushService from '../services/push.service';

export const Settings = () => {
  const { t } = useTranslation();
  const [allowPushNotifications, setAllowPushNotifications] = useState(false);

  useEffect(() => {
    (async () => {
      const existingSubscription = await pushService.getExistingSubscription();
      if (existingSubscription) {
        setAllowPushNotifications(true);
      }
    })();
  }, []);

  const allowPushNotificationsChanged = useCallback(
    async (_: ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
      if (data.checked) {
        setAllowPushNotifications(true);
        localStorage.setItem('pushAllowed', 'yes');
        await pushService.subscribe();
      } else {
        const existingSubscription = await pushService.getExistingSubscription();
        if (existingSubscription) {
          await pushService.unsubscribe();
        }
        localStorage.setItem('pushAllowed', 'no');
        setAllowPushNotifications(false);
      }
    },
    [setAllowPushNotifications],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Title1>{t('ui.settings.settings')}</Title1>
      <Title2>{t('ui.settings.pushNotifications')}</Title2>
      <Checkbox
        checked={allowPushNotifications}
        onChange={allowPushNotificationsChanged}
        size="large"
        label={t('ui.settings.enabled')}
      />
    </div>
  );
};

export default Settings;
