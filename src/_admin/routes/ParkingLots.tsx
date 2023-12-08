import { Body1, Button, Card, CardFooter, CardHeader, Text } from '@fluentui/react-components';
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
import { useToast } from '../../hooks/use-toast';
import zipService from '../../services/zip.service';
import downloadService from '../../services/download.service';

export const ParkingLots = () => {
  const { t } = useTranslation();
  const [parkingLots, setParkingLots] = useState<ParkingLotDto[]>([]);
  const { fromError, toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const lots = await parkingLotsService.getParkingLots();
        setParkingLots(lots);
      } catch (err) {
        fromError(err);
      }
    })();
  }, []);

  const downloadCertificates = useCallback(async (_id: string) => {
    try {
      const result = await parkingLotsService.getCertificate(_id);
      const zipBlob = await zipService.zipFiles({
        'ca.crt': result.caCrt,
        'client.crt': result.clientCertificateCrt,
        'client.key': result.clientCertificateKey
      });
      downloadService.downloadBlob(zipBlob, _id + '_certificate.zip');
    } catch (err) {
      fromError(err);
    }
  }, [fromError]);

  const deleteParkingLot = useCallback(
    async (_id: string, i: number) => {
      try {
        await parkingLotsService.deleteParkingLot(_id);
        const newParkingLots = [...parkingLots];
        newParkingLots.splice(i, 1);
        setParkingLots(newParkingLots);
        toast('success', t('ui.admin.parkingLots.deletedSuccessfully'));
      } catch (err: any) {
        fromError(err);
      }
    },
    [setParkingLots, parkingLots, t, fromError, toast],
  );

  const regenerateCertificate = useCallback(
    async (_id: string) => {
      try {
        await parkingLotsService.regenerateCertificate(_id);
        toast('success', t('ui.admin.parkingLots.regeneratedSuccessfully'));
      } catch (err: any) {
        fromError(err);
      }
    },
    [t, fromError, toast],
  );

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
                  {pl._id}, {pl.lat} - {pl.lng}
                </small>
              }
            ></CardHeader>
            <CardFooter
              action={
                <>
                  <Button
                    onClick={() => downloadCertificates(pl._id)}
                    appearance="subtle"
                    icon={<ArrowDownloadRegular />}
                  ></Button>
                  <ConfirmationButton
                    appearance="subtle"
                    onClick={() => regenerateCertificate(pl._id)}
                    icon={<ArrowSyncRegular />}
                  ></ConfirmationButton>
                  <Button appearance="subtle" icon={<EditRegular />}></Button>
                  <ConfirmationButton
                    onClick={() => deleteParkingLot(pl._id, i)}
                    appearance="subtle"
                    icon={<DeleteRegular />}
                  ></ConfirmationButton>
                </>
              }
            ></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParkingLots;
