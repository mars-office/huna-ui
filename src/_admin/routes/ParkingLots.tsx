import {
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
} from '@fluentui/react-components';
import {
  ArrowDownloadRegular,
  ArrowSyncRegular,
  DeleteRegular,
  EditRegular,
} from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import ConfirmationButton from '../../components/ConfirmationButton';
import { useCallback, useEffect, useState } from 'react';
import { ParkingLotDto } from '../dto/parkinglot.dto';
import parkingLotsService from '../services/parkinglots.service';

export const ParkingLots = () => {
  const { t } = useTranslation();
  const [parkingLots, setParkingLots] = useState<ParkingLotDto[]>([]);

  useEffect(() => {
    (async () => {
      const lots = await parkingLotsService.getParkingLots();
      setParkingLots(lots);
    })();
  }, []);

  const deleteParkingLot = useCallback((_id: string, i: number) => {
    (async () => {
      try {
        await parkingLotsService.deleteParkingLot(_id);
        const newParkingLots = [...parkingLots];
        newParkingLots.splice(i, 1);
        setParkingLots(newParkingLots);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [setParkingLots, parkingLots]);

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
      <Text size={500}>{t('ui.admin.parkingLots.parkingLots')}</Text>
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minHeight: '0px',
          overflow: 'auto',
        }}
      >
        {parkingLots.map((pl, i) => (
          <Card key={pl._id} appearance="filled-alternative">
            <CardHeader
              header={
                <Body1>
                  <b>{pl.name}</b>
                </Body1>
              }
              description={
                <small>
                  {pl.lat} - {pl.lng}
                </small>
              }
            ></CardHeader>
            <CardPreview>{pl._id}</CardPreview>
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
                onClick={() => deleteParkingLot(pl._id, i)}
                appearance="subtle"
                icon={<DeleteRegular />}
              >
                {t('ui.admin.parkingLots.delete')}
              </ConfirmationButton>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParkingLots;
