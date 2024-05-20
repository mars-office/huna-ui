import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from '@fluentui/react-components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface UpdateDialogProps {
  isVisible: boolean;
  onInstall?: () => Promise<void>;
  onReject?: () => void;
}

export const UpdateDialog = (props: UpdateDialogProps) => {
  const { t } = useTranslation();

  const yesClick = useCallback(async () => {
    if (!props.onInstall) {
      return;
    }
    await props.onInstall();
  }, [props.onInstall]);

  const noClick = useCallback(() => {
    if (!props.onReject) {
      return;
    }
    props.onReject();
  }, [props.onReject]);

  return (
    <Dialog modalType="alert" open={props.isVisible}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{t('ui.update.updateDownloaded')}</DialogTitle>
          <DialogContent>{t('ui.update.reloadToInstallUpdate')}</DialogContent>
          <DialogActions>
            <Button onClick={noClick} appearance="secondary">
              {t('ui.update.no')}
            </Button>
            <Button onClick={yesClick} appearance="primary">
              {t('ui.update.yes')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default UpdateDialog;
