import { Button } from '@fluentui/react-button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-dialog';
import { useTranslation } from 'react-i18next';
import environment from '../environment';

export interface VersionDetailsProps {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}

export const VersionDetails = (props: VersionDetailsProps) => {
  const {t} = useTranslation();

  return (
    <Dialog
      open={props.open}
      onOpenChange={(_, data) => {
        props.setOpen(data.open);
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{t('ui.versionDetails.versionDetails')}</DialogTitle>
          <DialogContent>
            <b>{environment.hunaVersion}</b><br />
            {environment.hunaVersionDetails}
          </DialogContent>

          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{t('ui.versionDetails.close')}</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default VersionDetails;
