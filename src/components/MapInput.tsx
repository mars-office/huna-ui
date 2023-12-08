import { Map } from 'leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';

export interface MapInputProps {
  height?: number;
  zoom?: number;
  value: number[];
  scrollWheelZoom?: boolean;
  valueChanged?: (v: number[]) => void;
}

export interface LocationMarkerProps {
  value: number[];
  valueChanged?: (value: number[]) => void;
}

const LocationMarker = (props: LocationMarkerProps) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue([props.value[0], props.value[1]]);
  }, [setValue, props.value]);

  useMapEvent('click', e => {
    const v = [+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5)];
    setValue(v);
    if (props.valueChanged) {
      props.valueChanged(v);
    }
  });
  return <Marker position={[value[0], value[1]]}></Marker>;
}

export const MapInput = (props: MapInputProps) => {
  const map = useRef<Map>(null);

  useEffect(() => {
    map.current?.setView([props.value[0], props.value[1]]);
  }, [map, props.value]);

  const onValueChanged = useCallback((val: number[]) => {
    if (props.valueChanged) {
      props.valueChanged(val);
    }
  }, [props]);
  return (
    <MapContainer
      ref={map}
      style={{ height: (props.height || 250) + 'px' }}
      center={[props.value[0], props.value[1]]}
      zoom={props.zoom || 13}
      scrollWheelZoom={props.scrollWheelZoom || true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker valueChanged={onValueChanged} value={props.value} />
    </MapContainer>
  );
};

export default MapInput;
