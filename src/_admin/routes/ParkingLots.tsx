import {
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
} from '@fluentui/react-components';
import { ArrowDownloadRegular, ArrowSyncRegular, DeleteRegular, EditRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import ConfirmationButton from '../../components/ConfirmationButton';

export const ParkingLots = () => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
      <Text size={500}>{t('ui.admin.parkingLots.parkingLots')}</Text>
      <div style={{ flex: '1 1 auto', minHeight: '0px', overflow: 'auto' }}>
        <Card appearance='filled-alternative'>
          <CardHeader header={<Body1><b>header</b></Body1>} description={'lat lng'}></CardHeader>
          <CardPreview>asdasd</CardPreview>
          <CardFooter>
            <Button appearance="subtle" icon={<ArrowDownloadRegular />}>
              {t('ui.admin.parkingLots.downloadCertificate')}
            </Button>
            <ConfirmationButton appearance="subtle" icon={<ArrowSyncRegular />}>
              {t('ui.admin.parkingLots.regenerateCertificate')}
            </ConfirmationButton>
            <Button appearance="subtle" icon={<EditRegular />}>
              {t('ui.admin.parkingLots.edit')}
            </Button>
            <ConfirmationButton
              onClick={() => alert(1)}
              appearance="subtle"
              icon={<DeleteRegular />}
            >
              {t('ui.admin.parkingLots.delete')}
            </ConfirmationButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ParkingLots;
