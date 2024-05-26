import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';

export interface RequestPushNotificationsProps {
  isOpen: boolean;
  yesClick: () => Promise<void>,
  noClick: () => void
}

export const RequestPushNotifications = (props: RequestPushNotificationsProps) => {
  const { t } = useTranslation();

  return (
    <Dialog modalType="alert" open={props.isOpen}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{t('ui.requestPushNotifications.allowPushNotifications')}</DialogTitle>
          <DialogContent>{t('ui.requestPushNotifications.allowAppToSendPushNotifications')}</DialogContent>
          <DialogActions>
            <Button onClick={props.noClick} appearance="secondary">
              {t('ui.requestPushNotifications.no')}
            </Button>
            <Button onClick={props.yesClick} appearance="primary">
              {t('ui.requestPushNotifications.yes')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default RequestPushNotifications;
