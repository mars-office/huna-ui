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

export const PwaUpdate = () => {
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [updateSw, setUpdateSw] = useState<((reloadPage: boolean | undefined) => Promise<void>) | undefined>();

  useEffect(() => {
    (async () => {
      const updateFunction = registerSW({
        onRegisteredSW: (_, r) => {
          console.log('SW registered.');
          setTimeout(() => {
            console.log('SW update check scheduled');
            setInterval(() => {
              r?.update();
            }, 60 * 60 * 1000);
          }, 5000);
        },
        onRegisterError: e => {
          console.error('SW registration error', e);
        },
        onNeedRefresh: () => {
          setNeedsRefresh(true);
        }
      });
      setUpdateSw(updateFunction);
    })();
  }, []);

  console.log('Rendering PWA Update...');

  console.log('Needsupdate=', needsRefresh);

  const { t } = useTranslation();

  const yesClick = useCallback(async () => {
    setNeedsRefresh(false);
    if (!updateSw) {
      return;
    }
    await updateSw!(true);
  }, [setNeedsRefresh, updateSw]);

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
