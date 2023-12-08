import axios from 'axios';
import { ParkingLotDto } from '../dto/parkinglot.dto';
import { DownloadCertificateBundleResponseDto } from '../dto/download-certificate-bundle-response.dto';

export const parkingLotsService = {
  getParkingLots: async () => {
    return (
      await axios.get<ParkingLotDto[]>(
        `/api/parkinglots/admin/parkinglots`,
      )
    ).data;
  },
  getParkingLotById: async (_id: string) => {
    return (
      await axios.get<ParkingLotDto>(
        `/api/parkinglots/admin/parkinglots/${_id}`,
      )
    ).data;
  },
  createParkingLot: async (dto: ParkingLotDto) => {
    return (
      await axios.post<ParkingLotDto>(
        `/api/parkinglots/admin/parkinglots`,
        dto
      )
    ).data;
  },
  updateParkingLot: async (_id: string, dto: Partial<ParkingLotDto>) => {
    return (
      await axios.put<ParkingLotDto>(
        `/api/parkinglots/admin/parkinglots/${_id}`,
        dto
      )
    ).data;
  },
  regenerateCertificate: async (_id: string) => {
    return (
      await axios.put<ParkingLotDto>(
        `/api/parkinglots/admin/parkinglots/${_id}/regenerate`,
        null
      )
    ).data;
  },
  deleteParkingLot: async (_id: string) => {
    return (
      await axios.delete<ParkingLotDto>(
        `/api/parkinglots/admin/parkinglots/${_id}`
      )
    ).data;
  },
  getCertificate: async (_id: string) => {
    return (
      await axios.get<DownloadCertificateBundleResponseDto>(
        `/api/parkinglots/admin/parkinglots/${_id}/certificate`
      )
    ).data;
  },
};

export default parkingLotsService;
