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
import { registerSW } from 'virtual:pwa-register';

let updateSw: ((reloadPage: boolean | undefined) => Promise<void>) | undefined;

export const PwaUpdate = () => {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    const updateFunction = registerSW({
      onRegisteredSW: (_, r) => {
        console.log('SW registered.');
        setTimeout(() => {
          console.log('SW update check scheduled');
          setInterval(
            () => {
              r?.update();
            },
            60 * 60 * 1000,
          );
        }, 5000);
      },
      onRegisterError: (e) => {
        console.error('SW registration error', e);
      },
      onNeedRefresh: () => {
        setNeedsRefresh(true);
      },
    });
    updateSw = updateFunction;
  }, []);

  const { t } = useTranslation();

  const yesClick = useCallback(async () => {
    setNeedsRefresh(false);
    if (!updateSw) {
      return;
    }
    updateSw!(true);
  }, [setNeedsRefresh]);

  const noClick = useCallback(() => {
    setNeedsRefresh(false);
  }, [setNeedsRefresh]);

  return (
    <Dialog modalType="alert" open={needsRefresh}>
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
