import { StatusDto } from "./status.dto";

export interface ParkingLotDto {
  _id?: string;
  name: string;
  lat: number;
  lng: number;
  lastStatusTimestamp?: number;
  status?: StatusDto;
}