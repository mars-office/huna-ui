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
import { useRegisterSW } from 'virtual:pwa-register/react';


let checkForUpdateIntervalHandle: any;

export const PwaUpdate = () => {
  console.log('Rendering PWA Update...');
  const {
    // offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (_, r) => {
      if (!r) {
        console.error('PWA registration not found');
        return;
      }
      console.log('SW registered!');
      if (!checkForUpdateIntervalHandle) {
        console.log('Setting up scheduled update check.');
        checkForUpdateIntervalHandle = setInterval(() => {
          r.update();
        }, 60*60*1000);
      }
    },
    onRegisterError:(error) => {
        console.error('PWA registration error', error);
    },
  });
  console.log('Needsupdate=', needRefresh);
  const { t } = useTranslation();

  const yesClick = useCallback(async () => {
    setNeedRefresh(false);
    await updateServiceWorker(true);
  }, []);

  const noClick = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  return (
    <Dialog modalType="alert" open={needRefresh}>
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

export default PwaUpdate;
