import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogOpenChangeData,
  DialogOpenChangeEvent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@fluentui/react-components';
import { ParkingLotDto } from '../dto/parkinglot.dto';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import parkingLotsService from '../services/parkinglots.service';
import { useToast } from '../../hooks/use-toast';
import MapInput from '../../components/MapInput';

export interface AddEditParkingLotDialogProps {
  editedItem?: ParkingLotDto;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  itemAdded?: (dto: ParkingLotDto) => void;
  itemUpdated?: (dto: ParkingLotDto) => void;
}

export const AddEditParkingLotDialog = (props: AddEditParkingLotDialogProps) => {
  const { t } = useTranslation();
  const { fromError } = useToast();
  const [loading, setLoading] = useState(false);

  const [clone, setClone] = useState<ParkingLotDto>({
    _id: undefined,
    lat: 0,
    lng: 0,
    name: '',
  });

  useEffect(() => {
    setClone(
      props.editedItem
        ? { ...props.editedItem }
        : {
            _id: undefined,
            lat: 0,
            lng: 0,
            name: '',
          },
    );
  }, [props.editedItem, setClone]);

  const addOrUpdate = useCallback(
    async (ev: React.FormEvent) => {
      setLoading(true);
      ev.preventDefault();
      try {
        if (clone._id) {
          const editResult = await parkingLotsService.updateParkingLot(clone._id, clone);
          if (props.itemUpdated) {
            props.itemUpdated(editResult);
          }
        } else {
          const addResult = await parkingLotsService.createParkingLot(clone);
          if (props.itemAdded) {
            props.itemAdded(addResult);
          }
        }
        setClone({
          _id: undefined,
          lat: 0,
          lng: 0,
          name: '',
        });
        if (props.onOpenChange) {
          props.onOpenChange(false);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        fromError(err);
      }
    },
    [clone, props, fromError, setClone, setLoading],
  );

  const onOpenChange = useCallback(
    (_: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
      if (props.onOpenChange) {
        props.onOpenChange(data.open);
      }
    },
    [props],
  );

  const invalidForm = useMemo(() => {
    return !clone.name || clone.name.length === 0;
  }, [clone]);

  return (
    <Dialog open={props.open} onOpenChange={onOpenChange}>
      <DialogSurface>
        <form onSubmit={addOrUpdate}>
          <DialogBody>
            <DialogTitle>
              {clone._id
                ? t('ui.admin.addEditParkingLotDialog.editParkingLot')
                : t('ui.admin.addEditParkingLotDialog.addParkingLot')}
            </DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  id="name"
                  value={clone.name}
                  required
                  type="text"
                  onChange={(e) => setClone((s) => ({ ...s, name: e.target.value }))}
                  placeholder={t('ui.admin.addEditParkingLotDialog.name')}
                />
                <MapInput
                  valueChanged={(v) => setClone((s) => ({ ...s, lat: v[0], lng: v[1] }))}
                  value={[clone.lat, clone.lng]}
                />
                <Input
                  id="lat"
                  value={clone.lat.toString()}
                  required
                  type="number"
                  onChange={(e) => setClone((s) => ({ ...s, lat: +e.target.value }))}
                  placeholder={t('ui.admin.addEditParkingLotDialog.latitude')}
                />
                <Input
                  id="lng"
                  value={clone.lng.toString()}
                  required
                  type="number"
                  onChange={(e) => setClone((s) => ({ ...s, lng: +e.target.value }))}
                  placeholder={t('ui.admin.addEditParkingLotDialog.longitude')}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">
                  {t('ui.admin.addEditParkingLotDialog.close')}
                </Button>
              </DialogTrigger>
              <Button disabled={invalidForm || loading} type="submit" appearance="primary">
                {t('ui.admin.addEditParkingLotDialog.save')}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};

export default AddEditParkingLotDialog;
