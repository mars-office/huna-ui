import { Body1, Button, Card, CardFooter, CardHeader, Text } from '@fluentui/react-components';
import {
  AddRegular,
  ArrowDownloadRegular,
  ArrowRepeatAllRegular,
  ArrowSyncRegular,
  DeleteRegular,
  EditRegular,
} from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import ConfirmationButton from '../../components/ConfirmationButton';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ParkingLotDto } from '../dto/parkinglot.dto';
import parkingLotsService from '../services/parkinglots.service';
import { useToast } from '../../hooks/use-toast';
import zipService from '../../services/zip.service';
import downloadService from '../../services/download.service';
import AddEditParkingLotDialog from './AddEditParkingLotDialog';
import Loading from '../../layout/Loading';

export const ParkingLots = () => {
  const { t } = useTranslation();
  const [parkingLots, setParkingLots] = useState<ParkingLotDto[]>([]);
  const { fromError, toast } = useToast();
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<ParkingLotDto | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const parkingLotsListDiv = useRef<HTMLDivElement>(null);

  const loadParkingLots = useCallback(async () => {
    try {
      setLoading(true);
      const lots = await parkingLotsService.getParkingLots();
      setParkingLots(lots);
      setLoading(false);
    } catch (err) {
      fromError(err);
      setLoading(false);
    }
  }, [setLoading, fromError, setParkingLots]);

  useEffect(() => {
    (async () => {
      await loadParkingLots();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    parkingLotsListDiv.current?.scrollTo({ top: 0 });
  }, [parkingLots]);

  const downloadCertificates = useCallback(
    async (_id: string) => {
      try {
        const result = await parkingLotsService.getCertificate(_id);
        const zipBlob = await zipService.zipFiles({
          'ca.crt': result.caCrt,
          'client.crt': result.clientCertificateCrt,
          'client.key': result.clientCertificateKey,
          'config.json': JSON.stringify({
            id: result._id,
            server: window.location.origin.replace('https://', ''),
            serverPort: +window.location.port,
            otaServerPort: +window.location.port,
            otaServer: window.location.origin.replace('https://', 'ota.'),
            mqttServer: window.location.origin.replace('https://', 'emqx.'),
            mqttPort: 8883
          })
        });
        downloadService.downloadBlob(zipBlob, _id + '_certificate.zip');
      } catch (err) {
        fromError(err);
      }
    },
    [fromError],
  );

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

  const editClick = useCallback(
    (dto: ParkingLotDto) => {
      setEditedItem(dto);
      setAddEditOpen(true);
    },
    [setEditedItem, setAddEditOpen],
  );

  const dialogOpenChanged = useCallback(
    (o: boolean) => {
      setAddEditOpen(o);
      if (!o) {
        setTimeout(() => {
          setEditedItem(undefined);
        }, 300);
      }
    },
    [setEditedItem, setAddEditOpen],
  );

  const parkingLotAdded = useCallback(
    (dto: ParkingLotDto) => {
      setParkingLots((s) => [...s, dto].sort((a, b) => a.name.localeCompare(b.name)));
      toast('success', t('ui.admin.parkingLots.addedSuccessfully'));
    },
    [toast, t, setParkingLots],
  );

  const parkingLotUpdated = useCallback(
    (dto: ParkingLotDto) => {
      setParkingLots((s) => {
        const list = [...s];
        list[list.findIndex((z) => z._id === dto._id)] = dto;
        return list.sort((a, b) => a.name.localeCompare(b.name));
      });
      toast('success', t('ui.admin.parkingLots.editedSuccessfully'));
    },
    [toast, t, setParkingLots],
  );

  return (
    <>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Text size={500}>{t('ui.admin.parkingLots.parkingLots')}</Text>
        <div
          ref={parkingLotsListDiv}
          style={{
            flex: 'auto',
            minHeight: '0px',
            overflow: 'auto',
          }}
        >
          {loading && <Loading />}
          {!loading && (!parkingLots || parkingLots.length === 0) && (
            <div>{t('ui.admin.parkingLots.noItems')}</div>
          )}
          {!loading &&
            parkingLots.map((pl, i) => (
              <Card
                key={pl._id}
                style={{ marginBottom: i < parkingLots.length - 1 ? '1rem' : '0rem' }}
                appearance="filled-alternative"
              >
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
                        onClick={() => downloadCertificates(pl._id!)}
                        appearance="subtle"
                        icon={<ArrowDownloadRegular />}
                      ></Button>
                      <ConfirmationButton
                        appearance="subtle"
                        onClick={() => regenerateCertificate(pl._id!)}
                        icon={<ArrowSyncRegular />}
                      ></ConfirmationButton>
                      <Button
                        appearance="subtle"
                        onClick={() => editClick(pl)}
                        icon={<EditRegular />}
                      ></Button>
                      <ConfirmationButton
                        onClick={() => deleteParkingLot(pl._id!, i)}
                        appearance="subtle"
                        icon={<DeleteRegular />}
                      ></ConfirmationButton>
                    </>
                  }
                ></CardFooter>
              </Card>
            ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button onClick={() => setAddEditOpen(true)} icon={<AddRegular />}></Button>
          <Button onClick={loadParkingLots} icon={<ArrowRepeatAllRegular />}></Button>
        </div>
      </div>
      <AddEditParkingLotDialog
        itemAdded={parkingLotAdded}
        itemUpdated={parkingLotUpdated}
        onOpenChange={(o) => dialogOpenChanged(o)}
        open={addEditOpen}
        editedItem={editedItem}
      />
    </>
  );
};

export default ParkingLots;
