import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from '@fluentui/react-components';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import pushService from '../services/push.service';

export const RequestPushNotifications = () => {
  const { t } = useTranslation();
  const [pushSubscriptionDialogVisible, setPushSubscriptionDialogVisible] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        const existingPushSubscription = await pushService.getExistingSubscription();
        if (!existingPushSubscription) {
          const pushAllowed = localStorage.getItem('pushAllowed');
          if (!pushAllowed) {
            const hasPermissionFromBrowser = await pushService.hasPermission();
            if (!hasPermissionFromBrowser) {
              setPushSubscriptionDialogVisible(true);
            } else {
              await pushService.subscribe();
              localStorage.setItem('pushAllowed', 'yes');
            }
          }
        }
      }
    })();
  }, [auth, setPushSubscriptionDialogVisible]);

  const requestPushNotifications = useCallback(async () => {
    localStorage.setItem('pushAllowed', 'yes');
    try {
      await pushService.subscribe();
    } catch (err: any) {
      // ignored
      console.error(err);
    }
    setPushSubscriptionDialogVisible(false);
  }, [setPushSubscriptionDialogVisible]);

  const denyPushNotifications = useCallback(() => {
    localStorage.setItem('pushAllowed', 'no');
    setPushSubscriptionDialogVisible(false);
  }, [setPushSubscriptionDialogVisible]);

  return (
    <Dialog modalType="alert" open={pushSubscriptionDialogVisible}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{t('ui.requestPushNotifications.allowPushNotifications')}</DialogTitle>
          <DialogContent>
            {t('ui.requestPushNotifications.allowAppToSendPushNotifications')}
          </DialogContent>
          <DialogActions>
            <Button onClick={denyPushNotifications} appearance="secondary">
              {t('ui.requestPushNotifications.no')}
            </Button>
            <Button onClick={requestPushNotifications} appearance="primary">
              {t('ui.requestPushNotifications.yes')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default RequestPushNotifications;
